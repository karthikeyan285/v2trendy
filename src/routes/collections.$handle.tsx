import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCollectionByHandle } from "@/lib/shopify";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductGrid";

export const Route = createFileRoute("/collections/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${prettify(params.handle)} — V2 Trendy` },
      { name: "description", content: `Shop ${prettify(params.handle)} at V2 Trendy.` },
    ],
  }),
  component: CollectionPage,
});

function prettify(h: string) {
  return h
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function CollectionPage() {
  const { handle } = Route.useParams();
  const q = useQuery({
    queryKey: ["collection", handle],
    queryFn: () => fetchCollectionByHandle(handle, 50),
    staleTime: 60_000,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/collections" className="hover:text-foreground">Collections</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground">{q.data?.title ?? prettify(handle)}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl">
          {q.data?.title ?? prettify(handle)}
        </h1>
        {q.data?.description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {q.data.description}
          </p>
        )}
      </header>

      {q.isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : !q.data ? (
        <div className="rounded border border-dashed py-16 text-center">
          <p className="text-sm text-muted-foreground">Collection not found.</p>
          <Link to="/collections" className="mt-3 inline-block text-sm text-brand hover:underline">
            Browse all products
          </Link>
        </div>
      ) : (
        <ProductGrid products={q.data.products} />
      )}
    </div>
  );
}
