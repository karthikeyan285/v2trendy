import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useCustomerStore, e as formatMoney, f as fetchCustomer } from "./router-2OYwdekT.mjs";
import "../_libs/sonner.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/lucide-react.mjs";
function OrdersPage() {
  const token = useCustomerStore((s) => s.token);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["customer", token?.accessToken],
    queryFn: () => token ? fetchCustomer(token.accessToken) : null,
    enabled: !!token
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from({
      length: 3
    }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 animate-pulse rounded-lg bg-muted" }, i)) });
  }
  const orders = data?.orders.edges ?? [];
  if (!orders.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: "No orders yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Your order history will appear here." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: orders.map(({
    node: o
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-lg border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-wrap items-center justify-between gap-3 border-b pb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
          "Order #",
          o.orderNumber
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "Placed ",
          new Date(o.processedAt).toLocaleDateString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-muted px-2 py-1", children: o.fulfillmentStatus ?? "Pending" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatMoney(o.totalPrice) }),
        o.statusUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: o.statusUrl, target: "_blank", rel: "noopener noreferrer", className: "text-brand hover:underline", children: "Track" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-3 space-y-2", children: o.lineItems.edges.map(({
      node: li
    }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-3 text-sm", children: [
      li.variant?.image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: li.variant.image.url, alt: "", className: "h-12 w-10 rounded object-cover", loading: "lazy" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 line-clamp-1", children: li.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "× ",
        li.quantity
      ] })
    ] }, i)) })
  ] }, o.id)) });
}
export {
  OrdersPage as component
};
