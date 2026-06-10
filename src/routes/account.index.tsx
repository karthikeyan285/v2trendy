import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCustomerStore } from "@/stores/customerStore";
import { fetchCustomer } from "@/lib/shopify-customer";
import { formatMoney } from "@/lib/shopify";

export const Route = createFileRoute("/account/")({
  component: AccountOverview,
});

function AccountOverview() {
  const token = useCustomerStore((s) => s.token);
  const { data } = useQuery({
    queryKey: ["customer", token?.accessToken],
    queryFn: () => (token ? fetchCustomer(token.accessToken) : null),
    enabled: !!token,
  });

  const recent = data?.orders.edges.slice(0, 3) ?? [];
  const addr = data?.defaultAddress;

  return (
    <div className="space-y-8">
      <Card title="Recent orders" href="/account/orders" linkLabel="View all">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <ul className="divide-y">
            {recent.map(({ node: o }) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">Order #{o.orderNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(o.processedAt).toLocaleDateString()} ·{" "}
                    {o.fulfillmentStatus ?? "Pending"}
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {formatMoney(o.totalPrice)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Default address" href="/account/addresses" linkLabel="Manage">
        {addr ? (
          <address className="text-sm not-italic leading-relaxed text-muted-foreground">
            {addr.firstName} {addr.lastName}
            <br />
            {addr.address1}
            {addr.address2 ? `, ${addr.address2}` : ""}
            <br />
            {addr.city}, {addr.province} {addr.zip}
            <br />
            {addr.country}
            {addr.phone ? (
              <>
                <br />
                {addr.phone}
              </>
            ) : null}
          </address>
        ) : (
          <p className="text-sm text-muted-foreground">
            No address on file yet.
          </p>
        )}
      </Card>
    </div>
  );
}

function Card({
  title,
  href,
  linkLabel,
  children,
}: {
  title: string;
  href: "/account/orders" | "/account/addresses";
  linkLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-serif text-xl">{title}</h2>
        <Link to={href} className="text-xs text-brand hover:underline">
          {linkLabel}
        </Link>
      </div>
      {children}
    </section>
  );
}
