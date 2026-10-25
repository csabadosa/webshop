"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Category, Product } from "@/lib/catalog";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Cele mai vândute" },
  { key: "price-asc", label: "Preț crescător" },
  { key: "price-desc", label: "Preț descrescător" },
  { key: "name", label: "Denumire A–Z" },
];

export function ProductBrowser({
  products,
  categories,
  initialCategory = null,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string | null;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [sort, setSort] = useState<SortKey>("popular");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.lastPrice - b.lastPrice;
        case "price-desc":
          return b.lastPrice - a.lastPrice;
        case "name":
          return a.name.localeCompare(b.name, "ro");
        default:
          return b.revenue - a.revenue;
      }
    });
    return list;
  }, [products, query, category, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-40 lg:self-start">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-steel">
          Categorii
        </h2>
        <ul className="mt-3 space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`flex w-full items-center justify-between px-2 py-1.5 text-left text-sm transition-colors ${
                category === null
                  ? "bg-amber-tint font-medium text-amber-deep"
                  : "text-ink hover:bg-paper"
              }`}
            >
              <span>Toate</span>
              <span className="text-steel-light">{products.length}</span>
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => setCategory(c.name)}
                className={`flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left text-sm transition-colors ${
                  category === c.name
                    ? "bg-amber-tint font-medium text-amber-deep"
                    : "text-ink hover:bg-paper"
                }`}
              >
                <span>{c.name}</span>
                <span className="shrink-0 text-steel-light">{c.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Results */}
      <div>
        <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută după denumire sau cod…"
            className="w-full rounded-sm border border-line-strong bg-panel px-3 py-2 text-sm text-ink placeholder:text-steel-light focus:border-amber focus:outline-none sm:max-w-xs"
          />
          <label className="flex items-center gap-2 text-sm text-steel">
            <span className="shrink-0">Sortează</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-sm border border-line-strong bg-panel px-2 py-2 text-sm text-ink focus:border-amber focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-4 text-sm text-steel">
          {visible.length}{" "}
          {visible.length === 1 ? "produs" : "produse"}
          {category ? ` în „${category}”` : ""}
        </p>

        {visible.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((p) => (
              <ProductCard key={p.code} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-10 border border-dashed border-line-strong bg-panel p-10 text-center">
            <p className="font-display text-lg font-semibold text-ink">
              Niciun produs găsit
            </p>
            <p className="mt-2 text-sm text-steel">
              Încearcă alt termen de căutare sau alege altă categorie.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
