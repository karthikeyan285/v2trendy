import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchCollections, fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Sort = "best" | "new" | "price-asc" | "price-desc";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Shop all — V2 Trendy" },
      { name: "description", content: "Browse the full V2 Trendy collection." },
    ],
  }),
  component: AllCollectionsPage,
});

function AllCollectionsPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("best");
  const [activeCollection, setActiveCollection] = useState<string | null>(null);

  const products = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts({ first: 100 }),
    staleTime: 60_000,
  });
  const collections = useQuery({
    queryKey: ["collections", "all"],
    queryFn: () => fetchCollections(20),
    staleTime: 60_000,
  });

  const filtered = useMemo(() => {
    let list: ShopifyProduct[] = products.data ?? [];
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.node.title.toLowerCase().includes(needle) ||
          p.node.productType?.toLowerCase().includes(needle) ||
          p.node.tags?.some((t) => t.toLowerCase().includes(needle)),
      );
    }
    if (activeCollection) {
      list = list.filter((p) => p.node.productType === activeCollection);
    }
    const sorted = [...list];
    if (sort === "price-asc") {
      sorted.sort(
        (a, b) =>
          parseFloat(a.node.priceRange.minVariantPrice.amount) -
          parseFloat(b.node.priceRange.minVariantPrice.amount),
      );
    } else if (sort === "price-desc") {
      sorted.sort(
        (a, b) =>
          parseFloat(b.node.priceRange.minVariantPrice.amount) -
          parseFloat(a.node.priceRange.minVariantPrice.amount),
      );
    }
    return sorted;
  }, [products.data, q, sort, activeCollection]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl">Shop all</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
        </p>
      </header>

      {/* Filters bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="pl-9"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-md border bg-background px-3 py-2 text-sm"
          aria-label="Sort"
        >
          <option value="best">Best selling</option>
          <option value="new">New arrivals</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider">Collections</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <button
                onClick={() => setActiveCollection(null)}
                className={`w-full rounded px-2 py-1 text-left hover:bg-muted ${
                  !activeCollection ? "font-semibold text-brand" : ""
                }`}
              >
                All
              </button>
            </li>
            {collections.data?.map((c) => (
              <li key={c.id}>
                <Link
                  to="/collections/$handle"
                  params={{ handle: c.handle }}
                  className="block rounded px-2 py-1 hover:bg-muted"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Grid */}
        <div>
          {products.isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : products.isError ? (
            <p className="text-sm text-destructive">
              Failed to load products. Please try again.
            </p>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
