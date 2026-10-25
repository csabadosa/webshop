import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import {
  getCategories,
  getTopProducts,
  getAllProducts,
} from "@/lib/catalog";

export default function Home() {
  const categories = getCategories();
  const topProducts = getTopProducts(8);
  const featured = topProducts[0];
  const products = getAllProducts();
  const unitsSold = products.reduce((sum, p) => sum + p.totalQty, 0);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-paper sm:text-6xl lg:text-7xl">
              Uleiuri și consumabile auto,
              <span className="text-amber"> livrate din stoc.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-steel-light">
              De la ulei hidraulic la vrac și antigel, până la truse și
              accesorii de atelier. Catalog clar, prețuri de distribuitor,
              marfă pe stoc pentru ateliere și flote.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/produse"
                className="rounded-sm bg-amber px-6 py-3 font-display text-base font-semibold uppercase tracking-wide text-white transition-colors hover:bg-amber-deep"
              >
                Vezi catalogul
              </Link>
              <Link
                href="#cele-mai-vandute"
                className="rounded-sm border border-white/25 px-6 py-3 font-display text-base font-semibold uppercase tracking-wide text-paper transition-colors hover:border-amber hover:text-amber"
              >
                Cele mai vândute
              </Link>
            </div>
          </div>

          {/* Featured plate */}
          {featured && (
            <Link
              href={`/produse/${encodeURIComponent(featured.code)}`}
              className="group flex flex-col justify-between border border-white/15 bg-ink-soft p-6 transition-colors hover:border-amber"
            >
              <div className="flex items-center justify-between">
                <span className="bg-amber px-2 py-1 font-display text-[11px] font-semibold uppercase tracking-wider text-white">
                  Cel mai vândut
                </span>
                {featured.spec && (
                  <span className="font-display text-3xl font-bold leading-none text-amber">
                    {featured.spec}
                  </span>
                )}
              </div>
              <div className="mt-10">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-steel-light">
                  {featured.category}
                </span>
                <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-paper group-hover:text-amber">
                  {featured.name}
                </h2>
              </div>
              <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-4">
                <span className="font-mono text-[11px] text-steel-light">
                  cod {featured.code}
                </span>
                <span className="font-display text-2xl font-bold leading-none text-paper">
                  {featured.priceLabel}
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Ledger strip */}
        <div className="border-t border-white/10">
          <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-white/10 px-4 sm:px-6">
            <Stat value={`${products.length}`} label="produse în catalog" />
            <Stat value={`${categories.length}`} label="categorii" />
            <Stat
              value={unitsSold.toLocaleString("ro-RO")}
              label="bucăți livrate în ultimul an"
            />
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">
            Pe categorii
          </h2>
          <Link
            href="/produse"
            className="text-sm font-medium text-amber-deep transition-colors hover:text-amber"
          >
            Toate produsele
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categorii/${c.slug}`}
              className="group flex flex-col justify-between bg-panel p-5 transition-colors hover:bg-amber-tint"
            >
              <span className="font-display text-lg font-semibold leading-tight text-ink">
                {c.name}
              </span>
              <span className="mt-6 text-sm text-steel">
                {c.count} {c.count === 1 ? "produs" : "produse"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section
        id="cele-mai-vandute"
        className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-16 sm:px-6"
      >
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-ink">
            Cele mai vândute
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {topProducts.map((p) => (
            <ProductCard key={p.code} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-4 py-5 first:pl-0">
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block font-display text-2xl font-bold leading-none text-paper sm:text-3xl">
          {value}
        </span>
        <span className="mt-1.5 block text-[12px] text-steel-light">{label}</span>
      </dd>
    </div>
  );
}
