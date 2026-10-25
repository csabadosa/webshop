import rawCatalog from "@/data/catalog.json";

export type RawProduct = {
  code: string;
  name: string;
  um: string;
  totalQty: number;
  revenue: number;
  avgPrice: number;
  lastPrice: number;
  category: string;
};

export type Product = RawProduct & {
  /** Primary spec chip shown on the plate — usually volume, else a grade token. */
  spec: string | null;
  /** Secondary spec (grade/viscosity) when a volume is the primary one. */
  spec2: string | null;
  /** Formatted display price in lei. */
  priceLabel: string;
};

const products: RawProduct[] = rawCatalog as RawProduct[];

// --- spec parsing ----------------------------------------------------------
// Product names are terse workshop labels ("ULEI H46 20L A MOTOR OIL").
// We pull the two most useful technical tokens: a volume and a grade/viscosity.

const VOLUME_RE = /(\d+(?:[.,]\d+)?)\s?L\b/i;
const VISCOSITY_RE = /\b\d{1,2}W\d{2}\b/i; // 5W30, 10W40
const HYDRAULIC_RE = /\bH(?:LP)?\d{2,3}\b/i; // H46, HLP32
const COOLANT_RE = /\bG1[23]\b/i; // G12, G13

function parseSpecs(name: string): { volume: string | null; grade: string | null } {
  const volumeMatch = name.match(VOLUME_RE);
  const volume = volumeMatch ? volumeMatch[0].replace(/\s/g, "").toUpperCase() : null;

  const gradeMatch =
    name.match(VISCOSITY_RE) || name.match(HYDRAULIC_RE) || name.match(COOLANT_RE);
  const grade = gradeMatch ? gradeMatch[0].toUpperCase() : null;

  return { volume, grade };
}

// --- formatting ------------------------------------------------------------

const priceFormatter = new Intl.NumberFormat("ro-RO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} lei`;
}

function enrich(p: RawProduct): Product {
  const { volume, grade } = parseSpecs(p.name);
  const spec = volume ?? grade;
  const spec2 = volume && grade ? grade : null;
  return { ...p, spec, spec2, priceLabel: formatPrice(p.lastPrice) };
}

// --- category helpers ------------------------------------------------------

export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/&/g, "si")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type Category = {
  name: string;
  slug: string;
  count: number;
  /** Total units sold across the category — a proxy for how active it is. */
  totalQty: number;
};

// --- public API ------------------------------------------------------------

export function getAllProducts(): Product[] {
  return products.map(enrich);
}

export function getCategories(): Category[] {
  const map = new Map<string, Category>();
  for (const p of products) {
    const existing = map.get(p.category);
    if (existing) {
      existing.count += 1;
      existing.totalQty += p.totalQty;
    } else {
      map.set(p.category, {
        name: p.category,
        slug: slugifyCategory(p.category),
        count: 1,
        totalQty: p.totalQty,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return getAllProducts().filter((p) => slugifyCategory(p.category) === slug);
}

export function getProductByCode(code: string): Product | undefined {
  const raw = products.find((p) => p.code === code);
  return raw ? enrich(raw) : undefined;
}

/** Best sellers by revenue (the catalog is already ordered that way, but be explicit). */
export function getTopProducts(limit: number): Product[] {
  return getAllProducts()
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

/** Other products in the same category, excluding the given code. */
export function getRelatedProducts(product: Product, limit: number): Product[] {
  return getAllProducts()
    .filter((p) => p.category === product.category && p.code !== product.code)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}
