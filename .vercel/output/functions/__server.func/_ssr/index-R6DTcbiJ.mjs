import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as Button, b as fetchProducts, d as fetchCollections } from "./router-2OYwdekT.mjs";
import { P as ProductGridSkeleton, a as ProductGrid } from "./ProductGrid-DUinjCr9.mjs";
import "../_libs/sonner.mjs";
import { h as ArrowRight } from "../_libs/lucide-react.mjs";
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
function HomePage() {
  const featured = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => fetchProducts({
      first: 10
    }),
    staleTime: 6e4
  });
  const collections = useQuery({
    queryKey: ["collections", "home"],
    queryFn: () => fetchCollections(8),
    staleTime: 6e4
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:py-24 lg:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-[0.25em] text-brand", children: "New collection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-3 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl", children: [
          "Co-ord sets",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "starting from",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-brand", children: "₹1,000" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-md text-muted-foreground", children: "Handcrafted Indian ethnic wear in premium fabrics. Designed for the modern woman, made to be worn." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", children: "Shop the collection" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: "outline", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: {
            handle: "new-arrivals"
          }, children: "New arrivals" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative aspect-[4/5] overflow-hidden rounded-lg bg-muted md:aspect-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://v2trendy.com/cdn/shop/files/Banner-2.jpg?v=1775633531&width=1600", alt: "V2 Trendy co-ord sets", className: "h-full w-full object-cover", loading: "eager", fetchPriority: "high" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-16 lg:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Shop by category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Find your next favourite silhouette" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/collections", className: "hidden text-sm text-brand hover:underline sm:inline-flex sm:items-center", children: [
          "View all ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1 h-4 w-4" })
        ] })
      ] }),
      collections.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: Array.from({
        length: 4
      }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square animate-pulse rounded bg-muted" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: collections.data?.slice(0, 4).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/collections/$handle", params: {
        handle: c.handle
      }, className: "group relative aspect-square overflow-hidden rounded bg-muted", children: [
        c.image && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.image.url, alt: c.image.altText ?? c.title, className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105", loading: "lazy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/0 to-foreground/0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 bottom-0 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-serif text-lg text-background", children: c.title }) })
      ] }, c.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-4 py-8 lg:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-serif text-3xl", children: "Top picks of the week" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mt-2 h-0.5 w-12 bg-accent" })
      ] }),
      featured.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGridSkeleton, { count: 8 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ProductGrid, { products: featured.data ?? [] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", children: "View all products" }) }) })
    ] })
  ] });
}
export {
  HomePage as component
};
