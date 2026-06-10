import type { ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  emptyLabel = "No products found",
}: {
  products: ShopifyProduct[];
  emptyLabel?: string;
}) {
  if (!products.length) {
    return (
      <div className="rounded border border-dashed py-16 text-center text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((p) => (
        <ProductCard key={p.node.id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] animate-pulse rounded bg-muted" />
          <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
