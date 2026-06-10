import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { j as Route$2, p as prettify, k as fetchCollectionByHandle } from "./router-2OYwdekT.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as ProductGridSkeleton, a as ProductGrid } from "./ProductGrid-DUinjCr9.mjs";
import "../_libs/sonner.mjs";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
function CollectionPage() {
  const {
    handle
  } = Route$2.useParams();
  const q = useQuery({
    queryKey: ["collection", handle],
    queryFn: () => fetchCollectionByHandle(handle, 50),
    staleTime: 6e4
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 lg:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mb-4 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground", children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", className: "hover:text-foreground", children: "Collections" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: q.data?.title ?? prettify(handle) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl sm:text-4xl", children: q.data?.title ?? prettify(handle) }),
      q.data?.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 max-w-2xl text-sm text-muted-foreground", children: q.data.description })
    ] }),
    q.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGridSkeleton, { count: 12 }) : !q.data ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded border border-dashed py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Collection not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", className: "mt-3 inline-block text-sm text-brand hover:underline", children: "Browse all products" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: q.data.products })
  ] });
}
export {
  CollectionPage as component
};
