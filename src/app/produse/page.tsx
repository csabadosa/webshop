import type { Metadata } from "next";
import { ProductBrowser } from "@/components/ProductBrowser";
import { getAllProducts, getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catalog produse",
  description:
    "Toate uleiurile, lubrifianții și consumabilele auto din stoc. Caută după denumire sau cod, filtrează pe categorii.",
};

export default function ProductsPage() {
  const products = getAllProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-ink">
          Catalog produse
        </h1>
        <p className="mt-2 max-w-xl text-sm text-steel">
          Uleiuri, lubrifianți și consumabile pentru atelier și flotă. Prețuri
          informative, fără TVA.
        </p>
      </header>

      <ProductBrowser products={products} categories={categories} />
    </div>
  );
}
