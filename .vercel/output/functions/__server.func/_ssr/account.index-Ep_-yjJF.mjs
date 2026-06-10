import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useCustomerStore, e as formatMoney, f as fetchCustomer } from "./router-2OYwdekT.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/lucide-react.mjs";
function AccountOverview() {
  const token = useCustomerStore((s) => s.token);
  const {
    data
  } = useQuery({
    queryKey: ["customer", token?.accessToken],
    queryFn: () => token ? fetchCustomer(token.accessToken) : null,
    enabled: !!token
  });
  const recent = data?.orders.edges.slice(0, 3) ?? [];
  const addr = data?.defaultAddress;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Recent orders", href: "/account/orders", linkLabel: "View all", children: recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No orders yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: recent.map(({
      node: o
    }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium", children: [
          "Order #",
          o.orderNumber
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          new Date(o.processedAt).toLocaleDateString(),
          " ·",
          " ",
          o.fulfillmentStatus ?? "Pending"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: formatMoney(o.totalPrice) })
    ] }, o.id)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { title: "Default address", href: "/account/addresses", linkLabel: "Manage", children: addr ? /* @__PURE__ */ jsxRuntimeExports.jsxs("address", { className: "text-sm not-italic leading-relaxed text-muted-foreground", children: [
      addr.firstName,
      " ",
      addr.lastName,
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      addr.address1,
      addr.address2 ? `, ${addr.address2}` : "",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      addr.city,
      ", ",
      addr.province,
      " ",
      addr.zip,
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      addr.country,
      addr.phone ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        addr.phone
      ] }) : null
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No address on file yet." }) })
  ] });
}
function Card({
  title,
  href,
  linkLabel,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border bg-card p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: href, className: "text-xs text-brand hover:underline", children: linkLabel })
    ] }),
    children
  ] });
}
export {
  AccountOverview as component
};
