import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useCustomerStore, f as fetchCustomer } from "./router-2OYwdekT.mjs";
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
function AddressesPage() {
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
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-40 animate-pulse rounded-lg bg-muted" });
  }
  const addresses = data?.addresses.edges ?? [];
  const defaultId = data?.defaultAddress?.id;
  if (!addresses.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-card p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-xl", children: "No addresses saved" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Addresses you use at checkout will be saved here." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: addresses.map(({
    node: a
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-lg border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold", children: [
        a.firstName,
        " ",
        a.lastName
      ] }),
      a.id === defaultId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand", children: "Default" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("address", { className: "mt-2 text-sm not-italic leading-relaxed text-muted-foreground", children: [
      a.address1,
      a.address2 ? `, ${a.address2}` : "",
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      a.city,
      ", ",
      a.province,
      " ",
      a.zip,
      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
      a.country,
      a.phone ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        a.phone
      ] }) : null
    ] })
  ] }, a.id)) });
}
export {
  AddressesPage as component
};
