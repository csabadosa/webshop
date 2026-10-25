import Link from "next/link";
import type { Product } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produse/${encodeURIComponent(product.code)}`}
      className="group flex flex-col border border-line bg-panel transition-colors hover:border-ink focus-visible:border-ink"
    >
      {/* Plate header: category + volume spec */}
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 pb-3 pt-4">
        <span className="pt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-steel">
          {product.category}
        </span>
        {product.spec && (
          <span className="shrink-0 bg-amber-tint px-2 py-1 font-display text-base font-bold leading-none text-amber-deep">
            {product.spec}
          </span>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-1 flex-col px-4 py-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-amber-deep">
          {product.name}
        </h3>
        {product.spec2 && (
          <span className="mt-2 inline-flex w-fit border border-line-strong px-1.5 py-0.5 font-mono text-[11px] text-steel">
            {product.spec2}
          </span>
        )}
      </div>

      {/* Plate footer: SKU + price */}
      <div className="flex items-end justify-between gap-3 border-t border-line px-4 py-3">
        <span className="font-mono text-[11px] text-steel-light">
          cod {product.code}
        </span>
        <span className="text-right">
          <span className="block font-display text-xl font-bold leading-none text-ink">
            {product.priceLabel}
          </span>
          <span className="mt-1 block text-[11px] text-steel">/ {product.um.toLowerCase()}</span>
        </span>
      </div>
    </Link>
  );
}
