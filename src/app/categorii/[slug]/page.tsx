import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductBrowser } from "@/components/ProductBrowser";
import {
  getAllProducts,
  getCategories,
  getCategoryBySlug,
} from "@/lib/catalog";

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/categorii/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Categorie inexistentă" };
  return {
    title: category.name,
    description: `${category.name} — ${category.count} produse din stoc la BEKAHORT.`,
  };
}

export default function CategoryPage({
  params,
}: PageProps<"/categorii/[slug]">) {
  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryView params={params} />
    </Suspense>
  );
}

function CategorySkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="h-4 w-56 bg-line" />
      <div className="mt-8 h-10 w-72 bg-line" />
      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <div className="h-96 bg-panel" />
        <div className="h-96 bg-panel" />
      </div>
    </div>
  );
}

async function CategoryView({
  params,
}: {
  params: PageProps<"/categorii/[slug]">["params"];
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getAllProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <nav className="flex flex-wrap items-center gap-1.5 text-sm text-steel">
        <Link href="/" className="transition-colors hover:text-amber-deep">
          Acasă
        </Link>
        <span aria-hidden>/</span>
        <Link href="/produse" className="transition-colors hover:text-amber-deep">
          Catalog
        </Link>
        <span aria-hidden>/</span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <header className="mb-10 mt-6">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-ink">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-steel">
          {category.count} {category.count === 1 ? "produs" : "produse"} în stoc.
        </p>
      </header>

      <ProductBrowser
        products={products}
        categories={categories}
        initialCategory={category.name}
      />
    </div>
  );
}
