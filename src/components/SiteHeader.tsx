import Link from "next/link";
import { getCategories } from "@/lib/catalog";

export function SiteHeader() {
  const categories = getCategories();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-panel/95 backdrop-blur">
      {/* Utility strip */}
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 text-[12px] sm:px-6">
          <span className="text-steel-light">Distribuție uleiuri &amp; consumabile auto</span>
          <a
            href="tel:+40000000000"
            className="font-medium text-paper transition-colors hover:text-amber"
          >
            Comenzi: 0700 000 000
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-display text-2xl font-bold uppercase leading-none tracking-tight text-ink">
            Beka<span className="text-amber">hort</span>
          </span>
          <span
            aria-hidden
            className="hidden h-4 w-px bg-line-strong sm:block"
          />
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-steel sm:block">
            Oil &amp; Service
          </span>
        </Link>

        <Link
          href="/produse"
          className="rounded-sm bg-amber px-4 py-2 font-display text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-amber-deep"
        >
          Catalog complet
        </Link>
      </div>

      {/* Category rail */}
      <nav
        aria-label="Categorii"
        className="border-t border-line bg-panel"
      >
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/produse"
            className="whitespace-nowrap border-b-2 border-transparent px-2 py-2.5 text-sm font-medium text-steel transition-colors hover:border-amber hover:text-ink"
          >
            Toate
          </Link>
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categorii/${c.slug}`}
              className="whitespace-nowrap border-b-2 border-transparent px-2 py-2.5 text-sm font-medium text-steel transition-colors hover:border-amber hover:text-ink"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
