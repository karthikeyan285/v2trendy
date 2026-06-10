import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { b as fetchProducts, d as fetchCollections } from "./router-2OYwdekT.mjs";
import { P as ProductGridSkeleton, a as ProductGrid } from "./ProductGrid-DUinjCr9.mjs";
import { I as Input } from "./input-CZ1EVczw.mjs";
import "../_libs/sonner.mjs";
import { S as Search } from "../_libs/lucide-react.mjs";
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
function AllCollectionsPage() {
  const [q, setQ] = reactExports.useState("");
  const [sort, setSort] = reactExports.useState("best");
  const [activeCollection, setActiveCollection] = reactExports.useState(null);
  const products = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => fetchProducts({
      first: 100
    }),
    staleTime: 6e4
  });
  const collections = useQuery({
    queryKey: ["collections", "all"],
    queryFn: () => fetchCollections(20),
    staleTime: 6e4
  });
  const filtered = reactExports.useMemo(() => {
    let list = products.data ?? [];
    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter((p) => p.node.title.toLowerCase().includes(needle) || p.node.productType?.toLowerCase().includes(needle) || p.node.tags?.some((t) => t.toLowerCase().includes(needle)));
    }
    if (activeCollection) {
      list = list.filter((p) => p.node.productType === activeCollection);
    }
    const sorted = [...list];
    if (sort === "price-asc") {
      sorted.sort((a, b) => parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount));
    }
    return sorted;
  }, [products.data, q, sort, activeCollection]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-10 lg:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl sm:text-4xl", children: "Shop all" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
        filtered.length,
        " ",
        filtered.length === 1 ? "product" : "products"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search products", className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "rounded-md border bg-background px-3 py-2 text-sm", "aria-label": "Sort", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "best", children: "Best selling" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "new", children: "New arrivals" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price-asc", children: "Price: low to high" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price-desc", children: "Price: high to low" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-[200px_1fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mb-3 text-xs font-semibold uppercase tracking-wider", children: "Collections" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveCollection(null), className: `w-full rounded px-2 py-1 text-left hover:bg-muted ${!activeCollection ? "font-semibold text-brand" : ""}`, children: "All" }) }),
          collections.data?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: {
            handle: c.handle
          }, className: "block rounded px-2 py-1 hover:bg-muted", children: c.title }) }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: products.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGridSkeleton, { count: 12 }) : products.isError ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: "Failed to load products. Please try again." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: filtered }) })
    ] })
  ] });
}
export {
  AllCollectionsPage as component
};
