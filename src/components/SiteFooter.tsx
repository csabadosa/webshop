import Link from "next/link";
import { getCategories } from "@/lib/catalog";

export function SiteFooter() {
  const categories = getCategories().slice(0, 8);

  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="font-display text-2xl font-bold uppercase leading-none tracking-tight">
            Beka<span className="text-amber">hort</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel-light">
            Uleiuri de motor și hidraulice, lubrifianți, antigel, AdBlue și
            accesorii — livrate din stoc către ateliere, flote și service-uri.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-paper">
            Categorii
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/categorii/${c.slug}`}
                  className="text-steel-light transition-colors hover:text-amber"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-paper">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-steel-light">
            <li>
              <a href="tel:+40000000000" className="transition-colors hover:text-amber">
                0700 000 000
              </a>
            </li>
            <li>
              <a
                href="mailto:comenzi@bekahort.ro"
                className="transition-colors hover:text-amber"
              >
                comenzi@bekahort.ro
              </a>
            </li>
            <li>Luni–Vineri, 08:00–17:00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-[12px] text-steel-light sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {2026} BEKAHORT. Toate drepturile rezervate.</span>
          <span>Prețuri informative, fără TVA. Stoc orientativ.</span>
        </div>
      </div>
    </footer>
  );
}
