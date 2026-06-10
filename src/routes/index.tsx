import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { fetchCollections, fetchProducts } from "@/lib/shopify";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "V2 Trendy — Premium Indian Ethnic Wear" },
      {
        name: "description",
        content:
          "Discover handcrafted kurtas, co-ord sets, and tunics. Garments crafted with passion.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({ first: 10 }),
    staleTime: 60_000,
  });
  const collections = useQuery({
    queryKey: ["collections", "home"],
    queryFn: () => fetchCollections(8),
    staleTime: 60_000,
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:py-24 lg:px-6">
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.25em] text-brand">
              New collection
            </span>
            <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Co-ord sets
              <br />
              starting from
              <br />
              <span className="text-brand">₹1,000</span>
            </h1>
            <p className="mt-5 max-w-md text-muted-foreground">
              Handcrafted Indian ethnic wear in premium fabrics. Designed for the modern
              woman, made to be worn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/collections">Shop the collection</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/collections/$handle" params={{ handle: "new-arrivals" }}>
                  New arrivals
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted md:aspect-auto">
            <img
              src="https://v2trendy.com/cdn/shop/files/Banner-2.jpg?v=1775633531&width=1600"
              alt="V2 Trendy co-ord sets"
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl">Shop by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Find your next favourite silhouette
            </p>
          </div>
          <Link
            to="/collections"
            className="hidden text-sm text-brand hover:underline sm:inline-flex sm:items-center"
          >
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {collections.isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {collections.data?.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                to="/collections/$handle"
                params={{ handle: c.handle }}
                className="group relative aspect-square overflow-hidden rounded bg-muted"
              >
                {c.image && (
                  <img
                    src={c.image.url}
                    alt={c.image.altText ?? c.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-serif text-lg text-background">{c.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-serif text-3xl">Top picks of the week</h2>
          <div className="mx-auto mt-2 h-0.5 w-12 bg-accent" />
        </div>
        {featured.isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <ProductGrid products={featured.data ?? []} />
        )}
        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/collections">View all products</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
