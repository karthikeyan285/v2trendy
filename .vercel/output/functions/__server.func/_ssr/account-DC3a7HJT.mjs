import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useCustomerStore, B as Button, f as fetchCustomer } from "./router-2OYwdekT.mjs";
import "../_libs/sonner.mjs";
import { e as LoaderCircle, g as LogOut } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
function AccountLayout() {
  const navigate = useNavigate();
  const token = useCustomerStore((s) => s.token);
  const logout = useCustomerStore((s) => s.logout);
  const hasHydrated = useCustomerStore((s) => s.hasHydrated);
  const isAuthed = useCustomerStore((s) => s.isAuthenticated());
  reactExports.useEffect(() => {
    if (hasHydrated && !isAuthed) navigate({
      to: "/login"
    });
  }, [hasHydrated, isAuthed, navigate]);
  const customer = useQuery({
    queryKey: ["customer", token?.accessToken],
    queryFn: () => token ? fetchCustomer(token.accessToken) : null,
    enabled: !!token,
    staleTime: 3e4
  });
  if (!hasHydrated || !isAuthed && !token) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-6xl items-center justify-center px-4 py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-4 py-10 lg:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8 flex flex-wrap items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-serif text-3xl", children: [
          "Hello",
          customer.data?.firstName ? `, ${customer.data.firstName}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: customer.data?.email ?? customer.data?.phone ?? "" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: async () => {
        await logout();
        navigate({
          to: "/"
        });
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
        " Sign out"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-[200px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-row gap-1 overflow-x-auto lg:flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccountLink, { to: "/account", children: "Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccountLink, { to: "/account/orders", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccountLink, { to: "/account/addresses", children: "Addresses" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
function AccountLink({
  to,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, activeOptions: {
    exact: to === "/account"
  }, activeProps: {
    className: "bg-muted font-semibold text-brand"
  }, className: "rounded-md px-3 py-2 text-sm hover:bg-muted whitespace-nowrap", children });
}
export {
  AccountLayout as component
};
