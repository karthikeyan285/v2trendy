// Shopify Storefront API client + queries + types.
// All client-side. Token is a public Storefront Access Token (safe to ship).
import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "v2trendy.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "c2b1da0c06956d136c866b58823ebbed";

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: Money;
  compareAtPrice?: Money | null;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  image?: ShopifyImage | null;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  vendor?: string;
  productType?: string;
  tags?: string[];
  availableForSale?: boolean;
  priceRange: { minVariantPrice: Money; maxVariantPrice?: Money };
  compareAtPriceRange?: { minVariantPrice: Money; maxVariantPrice: Money };
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ id?: string; name: string; values: string[] }>;
}

export interface ShopifyProduct {
  node: ShopifyProductNode;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ShopifyImage | null;
}

export async function storefrontApiRequest<T = any>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<{ data?: T; errors?: Array<{ message: string }> } | undefined> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Storefront API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`Shopify HTTP ${response.status}`);
  }
  const data = await response.json();
  if (data.errors) {
    throw new Error(`Shopify: ${data.errors.map((e: any) => e.message).join(", ")}`);
  }
  return data;
}

/* ========== Product fragments ========== */

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

/* ========== Queries ========== */

export const PRODUCTS_QUERY = `
  ${PRODUCT_CARD_FRAGMENT}
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: BEST_SELLING) {
      edges { node { ...ProductCard } }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_FULL_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) { ...ProductFull }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first, sortKey: UPDATED_AT) {
      edges { node {
        id title handle description
        image { url altText width height }
      } }
    }
  }
`;

export const COLLECTION_BY_HANDLE_QUERY = `
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

/* ========== Fetchers ========== */

export async function fetchProducts(opts: { first?: number; query?: string } = {}) {
  const res = await storefrontApiRequest(PRODUCTS_QUERY, {
    first: opts.first ?? 24,
    query: opts.query ?? null,
  });
  const edges = (res?.data as any)?.products?.edges ?? [];
  return edges as ShopifyProduct[];
}

export async function fetchProductByHandle(handle: string) {
  const res = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return ((res?.data as any)?.product ?? null) as ShopifyProductNode | null;
}

export async function fetchCollections(first = 12) {
  const res = await storefrontApiRequest(COLLECTIONS_QUERY, { first });
  const edges = (res?.data as any)?.collections?.edges ?? [];
  return edges.map((e: any) => e.node) as ShopifyCollection[];
}

export async function fetchCollectionByHandle(handle: string, first = 36) {
  const res = await storefrontApiRequest(COLLECTION_BY_HANDLE_QUERY, { handle, first });
  const c = (res?.data as any)?.collection;
  if (!c) return null;
  return {
    ...c,
    products: (c.products?.edges ?? []) as ShopifyProduct[],
  } as ShopifyCollection & { products: ShopifyProduct[] };
}

/* ========== Formatting ========== */

export function formatMoney(money: Money | undefined | null) {
  if (!money) return "";
  const n = Number(money.amount);
  if (money.currencyCode === "INR") {
    return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: money.currencyCode,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${money.currencyCode} ${n.toFixed(0)}`;
  }
}
