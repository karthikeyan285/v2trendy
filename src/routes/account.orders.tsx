import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCustomerStore } from "@/stores/customerStore";
import { fetchCustomer } from "@/lib/shopify-customer";
import { formatMoney } from "@/lib/shopify";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const token = useCustomerStore((s) => s.token);
  const { data, isLoading } = useQuery({
    queryKey: ["customer", token?.accessToken],
    queryFn: () => (token ? fetchCustomer(token.accessToken) : null),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  const orders = data?.orders.edges ?? [];

  if (!orders.length) {
    return (
      <div className="rounded-lg border bg-card p-10 text-center">
        <h2 className="font-serif text-xl">No orders yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your order history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(({ node: o }) => (
        <article key={o.id} className="rounded-lg border bg-card p-5">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <div className="font-semibold">Order #{o.orderNumber}</div>
              <div className="text-xs text-muted-foreground">
                Placed {new Date(o.processedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="rounded-full bg-muted px-2 py-1">
                {o.fulfillmentStatus ?? "Pending"}
              </span>
              <span className="font-semibold">{formatMoney(o.totalPrice)}</span>
              {o.statusUrl && (
                <a
                  href={o.statusUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  Track
                </a>
              )}
            </div>
          </header>
          <ul className="mt-3 space-y-2">
            {o.lineItems.edges.map(({ node: li }, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                {li.variant?.image && (
                  <img
                    src={li.variant.image.url}
                    alt=""
                    className="h-12 w-10 rounded object-cover"
                    loading="lazy"
                  />
                )}
                <span className="flex-1 line-clamp-1">{li.title}</span>
                <span className="text-muted-foreground">× {li.quantity}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
