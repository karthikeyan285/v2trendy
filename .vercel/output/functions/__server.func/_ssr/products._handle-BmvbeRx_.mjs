import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Route$3, h as useCartStore, e as formatMoney, B as Button, g as fetchProductByHandle } from "./router-2OYwdekT.mjs";
import { c as Minus, P as Plus, e as LoaderCircle, a as ShoppingBag } from "../_libs/lucide-react.mjs";
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
function ProductPage() {
  const {
    handle
  } = Route$3.useParams();
  const q = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 6e4
  });
  const product = q.data;
  const variants = reactExports.useMemo(() => product?.variants.edges.map((e) => e.node) ?? [], [product]);
  const [selected, setSelected] = reactExports.useState({});
  const [qty, setQty] = reactExports.useState(1);
  const [activeImg, setActiveImg] = reactExports.useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  reactExports.useMemo(() => {
    if (!product) return false;
    if (Object.keys(selected).length > 0) return true;
    const v = variants.find((v2) => v2.availableForSale) ?? variants[0];
    if (!v) return true;
    const map = {};
    v.selectedOptions.forEach((o) => map[o.name] = o.value);
    setSelected(map);
    return true;
  }, [product, variants, selected]);
  const currentVariant = reactExports.useMemo(() => {
    if (!product) return null;
    return variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? null;
  }, [variants, selected, product]);
  if (q.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-10 lg:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] animate-pulse rounded bg-muted" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-3/4 animate-pulse rounded bg-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-5 w-1/3 animate-pulse rounded bg-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-full animate-pulse rounded bg-muted" })
      ] })
    ] }) });
  }
  if (!product) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-3xl", children: "Product not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", className: "mt-4 inline-block text-sm text-brand hover:underline", children: "Browse all products" })
    ] });
  }
  const images = product.images.edges.map((e) => e.node);
  const main = images[activeImg] ?? images[0];
  const price = currentVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = currentVariant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice;
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const available = currentVariant?.availableForSale ?? false;
  const handleAdd = async () => {
    if (!currentVariant) {
      toast.error("Please select your options");
      return;
    }
    await addItem({
      product: {
        node: product
      },
      variantId: currentVariant.id,
      variantTitle: currentVariant.title,
      price: currentVariant.price,
      quantity: qty,
      selectedOptions: currentVariant.selectedOptions
    });
    toast.success("Added to bag", {
      description: product.title
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-8 lg:px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mb-4 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-foreground", children: "Home" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", className: "hover:text-foreground", children: "Shop" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-1", children: "/" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground line-clamp-1", children: product.title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-2 lg:gap-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] overflow-hidden rounded bg-muted", children: main && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: main.url, alt: main.altText ?? product.title, className: "h-full w-full object-cover", loading: "eager", fetchPriority: "high" }) }),
        images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 grid grid-cols-5 gap-2", children: images.slice(0, 5).map((img, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActiveImg(i), className: `aspect-[3/4] overflow-hidden rounded border-2 transition ${i === activeImg ? "border-brand" : "border-transparent"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: img.url, alt: "", className: "h-full w-full object-cover", loading: "lazy" }) }, img.url)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        product.vendor && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: product.vendor }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 font-serif text-3xl leading-tight", children: product.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-baseline gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-semibold", children: formatMoney(price) }),
          onSale && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base text-muted-foreground line-through", children: formatMoney(compareAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand", children: [
              "Save",
              " ",
              Math.round((1 - parseFloat(price.amount) / parseFloat(compareAt.amount)) * 100),
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Inclusive of all taxes" }),
        product.options.map((opt) => {
          if (opt.values.length <= 1) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: opt.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: selected[opt.name] ?? "Select" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: opt.values.map((val) => {
              const isActive = selected[opt.name] === val;
              const candidate = variants.find((v) => v.selectedOptions.every((o) => o.name === opt.name ? o.value === val : selected[o.name] ? selected[o.name] === o.value : true));
              const disabled = candidate ? !candidate.availableForSale : true;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected((s) => ({
                ...s,
                [opt.name]: val
              })), disabled, className: `min-w-[3rem] rounded-md border px-3 py-2 text-sm transition ${isActive ? "border-brand bg-brand text-brand-foreground" : "hover:border-foreground"} ${disabled ? "opacity-40 line-through" : ""}`, children: val }, val);
            }) })
          ] }, opt.name);
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 inline-flex items-center rounded-md border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 hover:bg-muted disabled:opacity-50", onClick: () => setQty((q2) => Math.max(1, q2 - 1)), disabled: qty <= 1, "aria-label": "Decrease quantity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-10 text-center text-sm", children: qty }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-2 hover:bg-muted", onClick: () => setQty((q2) => q2 + 1), "aria-label": "Increase quantity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-col gap-3 sm:flex-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", className: "flex-1", onClick: handleAdd, disabled: isLoading || !available, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : !available ? "Sold out" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "mr-2 h-4 w-4" }),
          "Add to bag"
        ] }) }) }),
        product.descriptionHtml ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prose prose-sm mt-10 max-w-none text-foreground/80", dangerouslySetInnerHTML: {
          __html: product.descriptionHtml
        } }) : product.description ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 whitespace-pre-line text-sm text-foreground/80", children: product.description }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-10 grid grid-cols-2 gap-4 border-t pt-6 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Free shipping on prepaid orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ 7-day easy returns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Premium quality fabrics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Secure checkout" })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProductPage as component
};
