import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { c as create, p as persist, a as createJSONStorage } from "../_libs/zustand.mjs";
import { T as Toaster$1, t as toast } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { R as Root, P as Portal, C as Content, a as Close, T as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { M as Menu, S as Search, U as User, a as ShoppingBag, X, b as Shield, T as Truck, R as RefreshCw, L as Leaf, c as Minus, P as Plus, d as Trash2, e as LoaderCircle, E as ExternalLink } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-compose-refs.mjs";
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
const appCss = "/assets/styles-unpxY9su.css";
const messages = [
  "Free shipping on all prepaid orders",
  "Easy 7-day returns",
  "Shop our latest arrivals"
];
function AnnouncementBar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-foreground text-background text-xs sm:text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-2 overflow-hidden whitespace-nowrap", children: messages.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: i === 0 ? "" : "hidden md:inline", children: m }, m)) }) });
}
const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = "v2trendy.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = "c2b1da0c06956d136c866b58823ebbed";
async function storefrontApiRequest(query, variables = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });
  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Storefront API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade."
    });
    return void 0;
  }
  if (!response.ok) {
    throw new Error(`Shopify HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data.errors) {
    throw new Error(`Shopify: ${data.errors.map((e) => e.message).join(", ")}`);
  }
  return data;
}
const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCard on Product {
    id
    title
    handle
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    images(first: 2) { edges { node { url altText width height } } }
    variants(first: 1) {
      edges { node {
        id
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
      } }
    }
    options { name values }
  }
`;
const PRODUCT_FULL_FRAGMENT = `
  fragment ProductFull on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    availableForSale
    priceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    compareAtPriceRange {
      minVariantPrice { amount currencyCode }
      maxVariantPrice { amount currencyCode }
    }
    images(first: 10) { edges { node { url altText width height } } }
    variants(first: 50) {
      edges { node {
        id
        title
        availableForSale
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
        image { url altText width height }
      } }
    }
    options { id name values }
  }
`;
const PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: BEST_SELLING) {
      edges { node { ...ProductCard } }
    }
  }
`;
const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FULL_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFull }
  }
`;
const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first, sortKey: UPDATED_AT) {
      edges { node {
        id title handle description
        image { url altText width height }
      } }
    }
  }
`;
const COLLECTION_BY_HANDLE_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id title handle description
      image { url altText width height }
      products(first: $first, sortKey: BEST_SELLING) {
        edges { node { ...ProductCard } }
      }
    }
  }
`;
async function fetchProducts(opts = {}) {
  const res = await storefrontApiRequest(PRODUCTS_QUERY, {
    first: opts.first ?? 24,
    query: opts.query ?? null
  });
  const edges = res?.data?.products?.edges ?? [];
  return edges;
}
async function fetchProductByHandle(handle) {
  const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return res?.data?.product ?? null;
}
async function fetchCollections(first = 12) {
  const res = await storefrontApiRequest(COLLECTIONS_QUERY, { first });
  const edges = res?.data?.collections?.edges ?? [];
  return edges.map((e) => e.node);
}
async function fetchCollectionByHandle(handle, first = 36) {
  const res = await storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, { handle, first });
  const c = res?.data?.collection;
  if (!c) return null;
  return {
    ...c,
    products: c.products?.edges ?? []
  };
}
function formatMoney(money) {
  if (!money) return "";
  const n = Number(money.amount);
  if (money.currencyCode === "INR") {
    return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: money.currencyCode,
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return `${money.currencyCode} ${n.toFixed(0)}`;
  }
}
const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;
const CART_CREATE = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }`;
const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }`;
const CART_LINES_UPDATE = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } }
  }`;
const CART_LINES_REMOVE = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } }
  }`;
function formatCheckoutUrl(url) {
  try {
    const u = new URL(url);
    u.searchParams.set("channel", "online_store");
    return u.toString();
  } catch {
    return url;
  }
}
function isCartNotFound(errors) {
  return errors.some(
    (e) => e.message.toLowerCase().includes("cart not found") || e.message.toLowerCase().includes("does not exist")
  );
}
async function createShopifyCart(item) {
  const data = await storefrontApiRequest(CART_CREATE, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] }
  });
  const payload = data?.data?.cartCreate;
  if (payload?.userErrors?.length) return null;
  const cart = payload?.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}
async function addLine(cartId, item) {
  const data = await storefrontApiRequest(CART_LINES_ADD, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }]
  });
  const payload = data?.data?.cartLinesAdd;
  const errs = payload?.userErrors || [];
  if (isCartNotFound(errs)) return { success: false, cartNotFound: true };
  if (errs.length) return { success: false };
  const lines = payload?.cart?.lines?.edges || [];
  const newLine = lines.find((l) => l.node.merchandise.id === item.variantId);
  return { success: true, lineId: newLine?.node?.id };
}
async function updateLine(cartId, lineId, quantity) {
  const data = await storefrontApiRequest(CART_LINES_UPDATE, {
    cartId,
    lines: [{ id: lineId, quantity }]
  });
  const errs = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFound(errs)) return { success: false, cartNotFound: true };
  if (errs.length) return { success: false };
  return { success: true };
}
async function removeLine(cartId, lineId) {
  const data = await storefrontApiRequest(CART_LINES_REMOVE, { cartId, lineIds: [lineId] });
  const errs = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFound(errs)) return { success: false, cartNotFound: true };
  if (errs.length) return { success: false };
  return { success: true };
}
const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),
      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existing = items.find((i) => i.variantId === item.variantId);
        set({ isLoading: true });
        try {
          if (!cartId) {
            const res = await createShopifyCart({ ...item, lineId: null });
            if (res) {
              set({
                cartId: res.cartId,
                checkoutUrl: res.checkoutUrl,
                items: [{ ...item, lineId: res.lineId }],
                isOpen: true
              });
            }
          } else if (existing) {
            if (!existing.lineId) return;
            const newQty = existing.quantity + item.quantity;
            const res = await updateLine(cartId, existing.lineId, newQty);
            if (res.success) {
              set({
                items: get().items.map(
                  (i) => i.variantId === item.variantId ? { ...i, quantity: newQty } : i
                ),
                isOpen: true
              });
            } else if ("cartNotFound" in res && res.cartNotFound) {
              clearCart();
            }
          } else {
            const res = await addLine(cartId, { ...item, lineId: null });
            if (res.success) {
              set({
                items: [...get().items, { ...item, lineId: res.lineId ?? null }],
                isOpen: true
              });
            } else if ("cartNotFound" in res && res.cartNotFound) {
              clearCart();
            }
          }
        } catch (e) {
          console.error("addItem failed", e);
        } finally {
          set({ isLoading: false });
        }
      },
      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const res = await updateLine(cartId, item.lineId, quantity);
          if (res.success) {
            set({
              items: get().items.map(
                (i) => i.variantId === variantId ? { ...i, quantity } : i
              )
            });
          } else if ("cartNotFound" in res && res.cartNotFound) {
            clearCart();
          }
        } finally {
          set({ isLoading: false });
        }
      },
      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const res = await removeLine(cartId, item.lineId);
          if (res.success) {
            const next = get().items.filter((i) => i.variantId !== variantId);
            if (next.length === 0) clearCart();
            else set({ items: next });
          } else if ("cartNotFound" in res && res.cartNotFound) {
            clearCart();
          }
        } finally {
          set({ isLoading: false });
        }
      },
      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      getCheckoutUrl: () => get().checkoutUrl,
      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (e) {
          console.error("syncCart failed", e);
        } finally {
          set({ isSyncing: false });
        }
      }
    }),
    {
      name: "v2trendy-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        cartId: s.cartId,
        checkoutUrl: s.checkoutUrl
      })
    }
  )
);
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function Header() {
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [mobileOpen, setMobileOpen] = reactExports.useState(false);
  const close = () => setMobileOpen(false);
  const navLinkClass = "hover:text-accent transition-colors";
  const activeNav = { className: "text-accent" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 bg-brand text-brand-foreground shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "lg:hidden -ml-2 p-2",
          "aria-label": "Open menu",
          onClick: () => setMobileOpen(true),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-2xl font-bold tracking-wide text-accent", children: "V2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg sm:text-xl tracking-[0.2em] uppercase", children: "Trendy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden lg:flex items-center gap-8 text-sm font-medium uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", className: navLinkClass, activeProps: activeNav, children: "New Arrival" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "co-ord-set" }, className: navLinkClass, activeProps: activeNav, children: "Co-ord Set" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "ethnic-wear" }, className: navLinkClass, activeProps: activeNav, children: "Ethnic Wear" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "tunics" }, className: navLinkClass, activeProps: activeNav, children: "Tunics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", className: navLinkClass, children: "All" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", "aria-label": "Search", className: "p-2 hover:text-accent transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", "aria-label": "Account", className: "p-2 hover:text-accent transition-colors hidden sm:inline-flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { "aria-label": "Open cart", onClick: openCart, className: "relative p-2 hover:text-accent transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }),
          totalItems > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground", children: totalItems })
        ] })
      ] })
    ] }),
    mobileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 lg:hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-foreground/60", onClick: close }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-0 top-0 h-full w-80 max-w-[85%] bg-background text-foreground shadow-xl flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-xl", children: "Menu" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: close, "aria-label": "Close menu", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", onClick: close, className: "px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md", children: "New Arrival" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "co-ord-set" }, onClick: close, className: "px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md", children: "Co-ord Set" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "ethnic-wear" }, onClick: close, className: "px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md", children: "Ethnic Wear" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "tunics" }, onClick: close, className: "px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md", children: "Tunics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", onClick: close, className: "px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md", children: "All Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t mt-2 pt-2 flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account", onClick: close, className: "px-4 py-3 text-sm hover:bg-muted rounded-md", children: "My Account" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/orders", onClick: close, className: "px-4 py-3 text-sm hover:bg-muted rounded-md", children: "My Orders" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-auto p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", onClick: close, children: "Sign in" }) }) })
      ] })
    ] })
  ] });
}
const USPS = [
  { icon: Shield, title: "Premium Fabrics", sub: "Authentic quality textiles" },
  { icon: Truck, title: "Free Shipping", sub: "On all prepaid orders" },
  { icon: RefreshCw, title: "Easy Returns", sub: "7-day return policy" },
  { icon: Leaf, title: "Sustainable", sub: "Eco-friendly production" }
];
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "mt-24 border-t bg-secondary/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 lg:px-6", children: USPS.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(u.icon, { className: "h-6 w-6 shrink-0 text-brand", strokeWidth: 1.5 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: u.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: u.sub })
      ] })
    ] }, u.title)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-2xl font-bold text-accent", children: "V2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-serif text-lg uppercase tracking-[0.2em]", children: "Trendy" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Garments crafted with passion. Premium Indian ethnic wear for the modern woman." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider", children: "Shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections", className: "hover:text-foreground", children: "All Products" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "co-ord-set" }, className: "hover:text-foreground", children: "Co-ord Sets" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "ethnic-wear" }, className: "hover:text-foreground", children: "Ethnic Wear" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/collections/$handle", params: { handle: "tunics" }, className: "hover:text-foreground", children: "Tunics" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider", children: "Account" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "hover:text-foreground", children: "Sign in" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/register", className: "hover:text-foreground", children: "Create account" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/account/orders", className: "hover:text-foreground", children: "Track order" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-wider", children: "Help" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-2 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Shipping & returns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Contact us" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Privacy policy" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row lg:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " V2 Trendy. All rights reserved."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Secure checkout powered by Shopify" })
    ] }) })
  ] });
}
const Sheet = Root;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
function CartDrawer() {
  const {
    isOpen,
    setOpen,
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl
  } = useCartStore();
  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce(
    (n, i) => n + parseFloat(i.price.amount) * i.quantity,
    0
  );
  const currency = items[0]?.price.currencyCode ?? "INR";
  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: isOpen, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetContent, { className: "flex w-full flex-col sm:max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "font-serif text-2xl", children: "Your bag" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}` })
    ] }),
    items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "mb-4 h-12 w-12 text-muted-foreground", strokeWidth: 1.25 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Nothing here yet" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mx-6 flex-1 overflow-y-auto px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: items.map((item) => {
        const img = item.product.node.images.edges[0]?.node;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[3/4] w-20 shrink-0 overflow-hidden rounded bg-muted", children: img && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: img.url,
              alt: img.altText ?? item.product.node.title,
              className: "h-full w-full object-cover",
              loading: "lazy"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium line-clamp-2", children: item.product.node.title }),
            item.selectedOptions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-xs text-muted-foreground", children: item.selectedOptions.map((o) => o.value).join(" · ") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center rounded-md border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "p-1.5 hover:bg-muted disabled:opacity-50",
                    onClick: () => updateQuantity(item.variantId, item.quantity - 1),
                    disabled: isLoading,
                    "aria-label": "Decrease",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3 w-3" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center text-sm", children: item.quantity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "p-1.5 hover:bg-muted disabled:opacity-50",
                    onClick: () => updateQuantity(item.variantId, item.quantity + 1),
                    disabled: isLoading,
                    "aria-label": "Increase",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: formatMoney({
                amount: (parseFloat(item.price.amount) * item.quantity).toString(),
                currencyCode: item.price.currencyCode
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "self-start p-1 text-muted-foreground hover:text-destructive",
              onClick: () => removeItem(item.variantId),
              disabled: isLoading,
              "aria-label": "Remove",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] }, item.variantId);
      }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-t pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Subtotal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: formatMoney({ amount: subtotal.toString(), currencyCode: currency }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Shipping and taxes calculated at checkout." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full",
            size: "lg",
            onClick: handleCheckout,
            disabled: isLoading || isSyncing,
            children: isLoading || isSyncing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Checkout ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "ml-2 h-4 w-4" })
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
function useCartSync() {
  const syncCart = useCartStore((s) => s.syncCart);
  reactExports.useEffect(() => {
    syncCart();
    const onVis = () => {
      if (document.visibilityState === "visible") syncCart();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [syncCart]);
}
const KWIKPASS_MID = "763gimmua0xu2";
const KWIKPASS_ENV = "production";
const KWIKPASS_MERCHANT_INFO = {
  mid: KWIKPASS_MID,
  environment: KWIKPASS_ENV,
  type: "merchantInfo",
  integrationType: "CUSTOM_HEADLESS"
};
function isKwikPassConfigured() {
  return Boolean(KWIKPASS_MID);
}
function normalizeIndianPhone(raw) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return { ok: true, phone: digits, countryCode: "+91" };
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return { ok: true, phone: digits.slice(2), countryCode: "+91" };
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return { ok: true, phone: digits.slice(1), countryCode: "+91" };
  }
  return { ok: false, error: "Enter a valid 10-digit mobile number." };
}
const SDK_URLS = {
  sandbox: "https://sandbox.pdp.gokwik.co/kwikpass/plugin/build/kp-custom-merchant.js",
  production: "https://pdp.gokwik.co/kwikpass/plugin/build/kp-custom-merchant.js"
};
let loadPromise = null;
class KwikPassError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = "KwikPassError";
  }
  code;
}
function sdkUrl() {
  return SDK_URLS[KWIKPASS_ENV];
}
function removeStaleSdkScripts() {
  const active = sdkUrl();
  let removed = false;
  for (const url of Object.values(SDK_URLS)) {
    if (url === active) continue;
    if (document.querySelector(`script[src="${url}"]`)) {
      document.querySelector(`script[src="${url}"]`)?.remove();
      removed = true;
    }
  }
  if (removed) {
    delete window.__KP_LOGIN_SDK_INSTANCE__;
    loadPromise = null;
  }
}
function applyMerchantInfo() {
  if (typeof window === "undefined") return;
  window.merchantInfo = { ...KWIKPASS_MERCHANT_INFO };
}
function assertMerchantInfoReady() {
  if (!window.merchantInfo?.mid) {
    throw new KwikPassError(
      "window.merchantInfo must be set before loading the KwikPass SDK.",
      "merchant_info_missing"
    );
  }
}
function loadScript() {
  applyMerchantInfo();
  assertMerchantInfoReady();
  removeStaleSdkScripts();
  const url = sdkUrl();
  return new Promise((resolve, reject) => {
    let existing = document.querySelector(
      `script[src="${url}"]`
    );
    if (existing?.dataset.loaded === "true" && !window.__KP_LOGIN_SDK_INSTANCE__) {
      existing.remove();
      existing = null;
    }
    if (existing) {
      if (existing.dataset.loaded === "true") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener(
        "error",
        () => reject(new KwikPassError("KwikPass SDK failed to load.", "sdk_load"))
      );
      return;
    }
    const s = document.createElement("script");
    s.src = url;
    s.async = false;
    s.onload = () => {
      s.dataset.loaded = "true";
      resolve();
    };
    s.onerror = () => reject(new KwikPassError("KwikPass SDK failed to load.", "sdk_load"));
    document.head.appendChild(s);
  });
}
async function waitForSdkInstance(timeoutMs = 15e3) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const instance = window.__KP_LOGIN_SDK_INSTANCE__;
    if (instance && typeof instance.kpSendOTP === "function" && typeof instance.kpVerifyOTP === "function") {
      return instance;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new KwikPassError(
    "KwikPass SDK did not initialize in time.",
    "sdk_timeout"
  );
}
async function getSdkInstance() {
  if (typeof window === "undefined") {
    throw new KwikPassError("KwikPass is only available in the browser.", "ssr");
  }
  if (!isKwikPassConfigured()) {
    throw new KwikPassError("KwikPass Merchant ID is not configured.", "not_configured");
  }
  if (!loadPromise) {
    loadPromise = (async () => {
      applyMerchantInfo();
      assertMerchantInfoReady();
      await loadScript();
      const instance = await waitForSdkInstance();
      console.log("[KwikPass] SDK ready", {
        merchantInfo: window.merchantInfo,
        sdkInstance: window.__KP_LOGIN_SDK_INSTANCE__
      });
      return instance;
    })();
  }
  return loadPromise;
}
async function initKwikPass() {
  try {
    applyMerchantInfo();
    await getSdkInstance();
    return true;
  } catch (err) {
    console.error("[KwikPass] init failed", err);
    return false;
  }
}
async function sendKwikPassOtp(phone) {
  const parsed = normalizeIndianPhone(phone);
  if (!parsed.ok) throw new KwikPassError(parsed.error, "invalid_phone");
  const sdk = await getSdkInstance();
  let res;
  try {
    res = await sdk.kpSendOTP(parsed.phone);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new KwikPassError(msg || "Failed to send OTP.", "send_otp");
  }
  if (res.status !== 200) {
    const hint = res.status === 404 && KWIKPASS_ENV === "sandbox" ? " Sandbox API returned 404 — switch to VITE_KWIKPASS_ENVIRONMENT=production." : "";
    throw new KwikPassError(
      (res.message ?? res.error ?? "Failed to send OTP.") + hint,
      "send_otp"
    );
  }
}
async function verifyKwikPassOtp(input) {
  const parsed = normalizeIndianPhone(input.phone);
  if (!parsed.ok) throw new KwikPassError(parsed.error, "invalid_phone");
  const otp = input.otp.replace(/\D/g, "");
  if (otp.length < 4) {
    throw new KwikPassError("Enter the OTP sent to your phone.", "invalid_otp");
  }
  const sdk = await getSdkInstance();
  const res = await sdk.kpVerifyOTP({ phone: parsed.phone, otp });
  if (res.status !== 200) {
    throw new KwikPassError(
      res.message ?? res.error ?? "Invalid or expired OTP.",
      "verify_otp"
    );
  }
  const data = res.body?.data ?? res.data;
  const accessToken = data?.customerAccessToken ?? data?.shopifyCustomerAccessToken ?? data?.token;
  if (!accessToken) {
    throw new KwikPassError(
      "OTP verified but no customer token was returned.",
      "missing_token"
    );
  }
  return {
    accessToken,
    expiresAt: data?.expiresAt ?? data?.expires_at ?? new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString()
  };
}
async function kwikPassLogout() {
  try {
    const sdk = window.__KP_LOGIN_SDK_INSTANCE__;
    if (sdk?.handleKPLogout) await sdk.handleKPLogout();
  } catch {
  }
}
function onKwikPassLoginSuccess(cb) {
  const handle = (raw) => {
    const token = extractAccessToken(raw);
    if (token) cb(token, raw);
  };
  const winHandler = (e) => handle(e.detail ?? {});
  const events = [
    "kp-login-success",
    "kwikpass:login",
    "kwikpass:login:success",
    "kp:auth:success",
    "user-loggedin"
  ];
  events.forEach((ev) => window.addEventListener(ev, winHandler));
  if (isKwikPassConfigured()) {
    initKwikPass().catch(() => void 0);
  }
  return () => {
    events.forEach((ev) => window.removeEventListener(ev, winHandler));
  };
}
function extractAccessToken(raw) {
  if (!raw || typeof raw !== "object") return null;
  const r = raw;
  const candidates = [
    r.customerAccessToken,
    r.shopifyCustomerAccessToken,
    r.token,
    r["gk-access-token"],
    r.data?.token,
    r.data?.customerAccessToken
  ].filter(Boolean);
  for (const c of candidates) {
    if (typeof c === "string") {
      return { accessToken: c, expiresAt: defaultExpiry() };
    }
    if (c && typeof c === "object" && typeof c.accessToken === "string") {
      const t = c;
      return {
        accessToken: t.accessToken,
        expiresAt: t.expiresAt ?? defaultExpiry()
      };
    }
  }
  return null;
}
function defaultExpiry() {
  return new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
}
const CUSTOMER_QUERY = `
  query Customer($token: String!) {
    customer(customerAccessToken: $token) {
      id firstName lastName email phone
      defaultAddress { id firstName lastName address1 address2 city province country zip phone }
      addresses(first: 10) {
        edges { node { id firstName lastName address1 address2 city province country zip phone } }
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges { node {
          id orderNumber processedAt fulfillmentStatus financialStatus statusUrl
          totalPrice { amount currencyCode }
          lineItems(first: 10) { edges { node {
            title quantity
            variant { image { url altText } }
          } } }
        } }
      }
    }
  }
`;
const TOKEN_DELETE = `
  mutation CustomerAccessTokenDelete($token: String!) {
    customerAccessTokenDelete(customerAccessToken: $token) {
      deletedAccessToken
      userErrors { field message }
    }
  }
`;
async function customerLogout(token) {
  await storefrontApiRequest(TOKEN_DELETE, { token }).catch(() => void 0);
}
async function fetchCustomer(token) {
  const res = await storefrontApiRequest(CUSTOMER_QUERY, { token });
  return res?.data?.customer ?? null;
}
const useCustomerStore = create()(
  persist(
    (set, get) => ({
      token: null,
      hasHydrated: false,
      setToken: (t) => set({ token: t }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
      logout: async () => {
        const t = get().token;
        if (t?.accessToken) await customerLogout(t.accessToken);
        await kwikPassLogout().catch(() => void 0);
        set({ token: null });
      },
      isAuthenticated: () => {
        const t = get().token;
        if (!t) return false;
        return new Date(t.expiresAt).getTime() > Date.now();
      }
    }),
    {
      name: "v2trendy-customer",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
function useKwikPassBootstrap() {
  const setToken = useCustomerStore((s) => s.setToken);
  reactExports.useEffect(() => {
    if (!isKwikPassConfigured()) {
      console.warn(
        "[KwikPass] Merchant ID missing. Set VITE_KWIKPASS_MERCHANT_ID in .env."
      );
      return;
    }
    applyMerchantInfo();
    initKwikPass().catch((err) => console.error("[KwikPass] init error", err));
    const unsub = onKwikPassLoginSuccess((token) => {
      setToken(token);
      toast.success("Signed in");
    });
    return unsub;
  }, [setToken]);
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function SiteLayout() {
  useCartSync();
  useKwikPassBootstrap();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnnouncementBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartDrawer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { position: "top-center", richColors: true })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-7xl", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 font-serif text-xl", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-6 inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90",
        children: "Continue shopping"
      }
    )
  ] }) });
}
function ErrorComponent({ error, reset }) {
  const router2 = useRouter();
  console.error(error);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[60vh] items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-serif text-xl", children: "Something went wrong" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Please try again or head back to the homepage." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$b = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "V2 Trendy — Premium Indian Ethnic Wear" },
      {
        name: "description",
        content: "Shop premium kurtas, co-ord sets, ethnic wear and tunics. Garments crafted with passion."
      },
      { property: "og:title", content: "V2 Trendy — Premium Indian Ethnic Wear" },
      {
        property: "og:description",
        content: "Premium kurtas, co-ord sets, ethnic wear and tunics."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "V2 Trendy — Premium Indian Ethnic Wear" },
      { name: "description", content: "A premium, scalable Shopify storefront rebuilt for enhanced user experience and conversion." },
      { property: "og:description", content: "A premium, scalable Shopify storefront rebuilt for enhanced user experience and conversion." },
      { name: "twitter:description", content: "A premium, scalable Shopify storefront rebuilt for enhanced user experience and conversion." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5f200a16-b993-43fb-becf-be5e92eebae0/id-preview-5e2d5e24--7cb274cc-2d93-4dfe-96bb-ae2d3bada4b9.lovable.app-1779347477070.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5f200a16-b993-43fb-becf-be5e92eebae0/id-preview-5e2d5e24--7cb274cc-2d93-4dfe-96bb-ae2d3bada4b9.lovable.app-1779347477070.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
      },
      { rel: "preconnect", href: "https://v2trendy.myshopify.com" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  const merchantInfoScript = isKwikPassConfigured() ? `window.merchantInfo=${JSON.stringify(KWIKPASS_MERCHANT_INFO)};console.log("[KwikPass] merchantInfo configured",window.merchantInfo);` : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("head", { children: [
      merchantInfoScript ? /* @__PURE__ */ jsxRuntimeExports.jsx("script", { dangerouslySetInnerHTML: { __html: merchantInfoScript } }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$b.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiteLayout, {}) });
}
const BASE_URL = "https://project--7cb274cc-2d93-4dfe-96bb-ae2d3bada4b9.lovable.app";
const Route$a = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/collections", changefreq: "daily", priority: "0.9" },
          { path: "/login", changefreq: "yearly", priority: "0.3" },
          { path: "/register", changefreq: "yearly", priority: "0.3" }
        ];
        const urls = entries.map(
          (e) => `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
        ).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$9 = () => import("./register-Pj3OO_m9.mjs");
const Route$9 = createFileRoute("/register")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./login-D02tiz4H.mjs");
const Route$8 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in — V2 Trendy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./account-DC3a7HJT.mjs");
const Route$7 = createFileRoute("/account")({
  head: () => ({
    meta: [{
      title: "My account — V2 Trendy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-R6DTcbiJ.mjs");
const Route$6 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "V2 Trendy — Premium Indian Ethnic Wear"
    }, {
      name: "description",
      content: "Discover handcrafted kurtas, co-ord sets, and tunics. Garments crafted with passion."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./collections.index-CHsuC_zv.mjs");
const Route$5 = createFileRoute("/collections/")({
  head: () => ({
    meta: [{
      title: "Shop all — V2 Trendy"
    }, {
      name: "description",
      content: "Browse the full V2 Trendy collection."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./account.index-Ep_-yjJF.mjs");
const Route$4 = createFileRoute("/account/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./products._handle-BmvbeRx_.mjs");
const Route$3 = createFileRoute("/products/$handle")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${params.handle.replace(/-/g, " ")} — V2 Trendy`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
function prettify(h) {
  return h.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
const $$splitComponentImporter$2 = () => import("./collections._handle-DfAj8ze4.mjs");
const Route$2 = createFileRoute("/collections/$handle")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `${prettify(params.handle)} — V2 Trendy`
    }, {
      name: "description",
      content: `Shop ${prettify(params.handle)} at V2 Trendy.`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./account.orders-CjV8Wyx0.mjs");
const Route$1 = createFileRoute("/account/orders")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./account.addresses-D5HMDQu1.mjs");
const Route = createFileRoute("/account/addresses")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SitemapDotxmlRoute = Route$a.update({
  id: "/sitemap.xml",
  path: "/sitemap.xml",
  getParentRoute: () => Route$b
});
const RegisterRoute = Route$9.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$b
});
const LoginRoute = Route$8.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$b
});
const AccountRoute = Route$7.update({
  id: "/account",
  path: "/account",
  getParentRoute: () => Route$b
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$b
});
const CollectionsIndexRoute = Route$5.update({
  id: "/collections/",
  path: "/collections/",
  getParentRoute: () => Route$b
});
const AccountIndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => AccountRoute
});
const ProductsHandleRoute = Route$3.update({
  id: "/products/$handle",
  path: "/products/$handle",
  getParentRoute: () => Route$b
});
const CollectionsHandleRoute = Route$2.update({
  id: "/collections/$handle",
  path: "/collections/$handle",
  getParentRoute: () => Route$b
});
const AccountOrdersRoute = Route$1.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AccountRoute
});
const AccountAddressesRoute = Route.update({
  id: "/addresses",
  path: "/addresses",
  getParentRoute: () => AccountRoute
});
const AccountRouteChildren = {
  AccountAddressesRoute,
  AccountOrdersRoute,
  AccountIndexRoute
};
const AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AccountRoute: AccountRouteWithChildren,
  LoginRoute,
  RegisterRoute,
  SitemapDotxmlRoute,
  CollectionsHandleRoute,
  ProductsHandleRoute,
  CollectionsIndexRoute
};
const routeTree = Route$b._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  KwikPassError as K,
  Route$3 as R,
  initKwikPass as a,
  fetchProducts as b,
  cn as c,
  fetchCollections as d,
  formatMoney as e,
  fetchCustomer as f,
  fetchProductByHandle as g,
  useCartStore as h,
  isKwikPassConfigured as i,
  Route$2 as j,
  fetchCollectionByHandle as k,
  prettify as p,
  router as r,
  sendKwikPassOtp as s,
  useCustomerStore as u,
  verifyKwikPassOtp as v
};
