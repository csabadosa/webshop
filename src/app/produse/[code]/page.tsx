import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import {
  formatPrice,
  getAllProducts,
  getProductByCode,
  getRelatedProducts,
  slugifyCategory,
} from "@/lib/catalog";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ code: p.code }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produse/[code]">): Promise<Metadata> {
  const { code } = await params;
  const product = getProductByCode(decodeURIComponent(code));
  if (!product) return { title: "Produs inexistent" };
  return {
    title: product.name,
    description: `${product.name} — ${product.category}. Preț ${product.priceLabel} / ${product.um.toLowerCase()}. Cod ${product.code}.`,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/produse/[code]">) {
  const { code } = await params;
  const product = getProductByCode(decodeURIComponent(code));
  if (!product) notFound();

  const related = getRelatedProducts(product, 4);

  const specs: { label: string; value: string }[] = [
    { label: "Cod produs", value: product.code },
    { label: "Categorie", value: product.category },
    ...(product.spec ? [{ label: "Ambalaj / grad", value: product.spec }] : []),
    ...(product.spec2 ? [{ label: "Specificație", value: product.spec2 }] : []),
    { label: "Unitate de măsură", value: product.um },
    { label: "Preț mediu (12 luni)", value: formatPrice(product.avgPrice) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-steel">
        <Link href="/" className="transition-colors hover:text-amber-deep">
          Acasă
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/categorii/${slugifyCategory(product.category)}`}
          className="transition-colors hover:text-amber-deep"
        >
          {product.category}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Spec plate */}
        <div className="flex flex-col border border-ink bg-panel">
          <div className="flex items-start justify-between gap-4 border-b border-line px-6 pb-5 pt-6">
            <span className="pt-2 text-xs font-medium uppercase tracking-[0.14em] text-steel">
              {product.category}
            </span>
            {product.spec && (
              <span className="bg-amber px-3 py-2 font-display text-3xl font-bold leading-none text-white">
                {product.spec}
              </span>
            )}
          </div>
          <div className="flex flex-1 items-center px-6 py-14">
            <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
          </div>
          <div className="border-t border-line px-6 py-4 font-mono text-xs text-steel-light">
            cod {product.code}
          </div>
        </div>

        {/* Buy column */}
        <div className="flex flex-col">
          <div className="flex items-end gap-3">
            <span className="font-display text-4xl font-bold leading-none text-ink">
              {product.priceLabel}
            </span>
            <span className="pb-1 text-sm text-steel">
              / {product.um.toLowerCase()} · fără TVA
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:comenzi@bekahort.ro?subject=${encodeURIComponent(
                `Ofertă ${product.name} (cod ${product.code})`,
              )}`}
              className="rounded-sm bg-amber px-6 py-3 font-display text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-amber-deep"
            >
              Cere ofertă
            </a>
            <a
              href="tel:+40000000000"
              className="rounded-sm border border-line-strong px-6 py-3 font-display text-base font-semibold uppercase tracking-wide text-ink transition-colors hover:border-ink"
            >
              Sună pentru comandă
            </a>
          </div>
          <p className="mt-3 text-xs text-steel">
            Coș și plată online — în curând.
          </p>

          {/* Spec table */}
          <dl className="mt-8 border-t border-line">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between gap-4 border-b border-line py-3"
              >
                <dt className="text-sm text-steel">{s.label}</dt>
                <dd className="text-right text-sm font-medium text-ink">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-ink">
            Din aceeași categorie
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.code} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
