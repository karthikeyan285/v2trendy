import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as useCartStore, B as Button, e as formatMoney } from "./router-2OYwdekT.mjs";
function ProductCard({ product }) {
  const node = product.node;
  const img = node.images.edges[0]?.node;
  const hover = node.images.edges[1]?.node ?? img;
  const variant = node.variants.edges[0]?.node;
  const compareAt = node.compareAtPriceRange?.minVariantPrice;
  const price = node.priceRange.minVariantPrice;
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!variant) return;
    if (node.options.length > 1 || (node.options[0]?.values.length ?? 0) > 1) {
      window.location.href = `/products/${node.handle}`;
      return;
    }
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title ?? "Default",
      price: variant.price,
      quantity: 1,
      selectedOptions: []
    });
    toast.success("Added to bag", { description: node.title });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/products/$handle",
      params: { handle: node.handle },
      className: "group block",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[3/4] overflow-hidden rounded bg-muted", children: [
          img && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img.url,
              alt: img.altText ?? node.title,
              width: img.width ?? 600,
              height: img.height ?? 800,
              className: "h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0",
              loading: "lazy"
            }
          ),
          hover && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: hover.url,
              alt: "",
              "aria-hidden": true,
              className: "absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100",
              loading: "lazy"
            }
          ),
          onSale && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 top-2 rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-foreground", children: "Sale" }),
          !node.availableForSale && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-2 top-2 rounded bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background", children: "Sold out" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-2 bottom-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "w-full",
              onClick: handleAdd,
              disabled: isLoading || !node.availableForSale,
              children: node.availableForSale ? "Quick add" : "Sold out"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "line-clamp-2 text-sm font-medium leading-snug", children: node.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: formatMoney(price) }),
            onSale && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-through", children: formatMoney(compareAt) })
          ] })
        ] })
      ]
    }
  );
}
function ProductGrid({
  products,
  emptyLabel = "No products found"
}) {
  if (!products.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded border border-dashed py-16 text-center text-muted-foreground", children: emptyLabel });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { product: p }, p.node.id)) });
}
function ProductGridSkeleton({ count = 8 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6", children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] animate-pulse rounded bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 h-3 w-3/4 animate-pulse rounded bg-muted" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-3 w-1/3 animate-pulse rounded bg-muted" })
  ] }, i)) });
}
export {
  ProductGridSkeleton as P,
  ProductGrid as a
};
