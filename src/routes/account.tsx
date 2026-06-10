import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { useCustomerStore } from "@/stores/customerStore";
import { fetchCustomer } from "@/lib/shopify-customer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My account — V2 Trendy" }] }),
  component: AccountLayout,
});

function AccountLayout() {
  const navigate = useNavigate();
  const token = useCustomerStore((s) => s.token);
  const logout = useCustomerStore((s) => s.logout);
  const hasHydrated = useCustomerStore((s) => s.hasHydrated);
  const isAuthed = useCustomerStore((s) => s.isAuthenticated());

  // Only redirect once the persisted store has finished hydrating from
  // localStorage; otherwise we'd flash a blank page on every account route
  // refresh (the bug that made /account/orders look broken).
  useEffect(() => {
    if (hasHydrated && !isAuthed) navigate({ to: "/login" });
  }, [hasHydrated, isAuthed, navigate]);

  const customer = useQuery({
    queryKey: ["customer", token?.accessToken],
    queryFn: () => (token ? fetchCustomer(token.accessToken) : null),
    enabled: !!token,
    staleTime: 30_000,
  });

  if (!hasHydrated || (!isAuthed && !token)) {
    return (
      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-24">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">
            Hello{customer.data?.firstName ? `, ${customer.data.firstName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.data?.email ?? customer.data?.phone ?? ""}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await logout();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </header>

      <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
        <aside>
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
            <AccountLink to="/account">Overview</AccountLink>
            <AccountLink to="/account/orders">Orders</AccountLink>
            <AccountLink to="/account/addresses">Addresses</AccountLink>
          </nav>
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function AccountLink({
  to,
  children,
}: {
  to: "/account" | "/account/orders" | "/account/addresses";
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: to === "/account" }}
      activeProps={{ className: "bg-muted font-semibold text-brand" }}
      className="rounded-md px-3 py-2 text-sm hover:bg-muted whitespace-nowrap"
    >
      {children}
    </Link>
  );
}
