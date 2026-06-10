import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCustomerStore } from "@/stores/customerStore";
import { fetchCustomer } from "@/lib/shopify-customer";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const token = useCustomerStore((s) => s.token);
  const { data, isLoading } = useQuery({
    queryKey: ["customer", token?.accessToken],
    queryFn: () => (token ? fetchCustomer(token.accessToken) : null),
    enabled: !!token,
  });

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-lg bg-muted" />;
  }

  const addresses = data?.addresses.edges ?? [];
  const defaultId = data?.defaultAddress?.id;

  if (!addresses.length) {
    return (
      <div className="rounded-lg border bg-card p-10 text-center">
        <h2 className="font-serif text-xl">No addresses saved</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Addresses you use at checkout will be saved here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {addresses.map(({ node: a }) => (
        <article key={a.id} className="rounded-lg border bg-card p-5">
          <div className="flex items-start justify-between">
            <div className="text-sm font-semibold">
              {a.firstName} {a.lastName}
            </div>
            {a.id === defaultId && (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                Default
              </span>
            )}
          </div>
          <address className="mt-2 text-sm not-italic leading-relaxed text-muted-foreground">
            {a.address1}
            {a.address2 ? `, ${a.address2}` : ""}
            <br />
            {a.city}, {a.province} {a.zip}
            <br />
            {a.country}
            {a.phone ? (
              <>
                <br />
                {a.phone}
              </>
            ) : null}
          </address>
        </article>
      ))}
    </div>
  );
}
