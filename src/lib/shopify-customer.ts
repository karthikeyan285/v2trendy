// Storefront API customer auth + account queries.
import { storefrontApiRequest } from "./shopify";

export interface CustomerAddress {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  zip?: string | null;
  phone?: string | null;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  fulfillmentStatus?: string | null;
  financialStatus?: string | null;
  statusUrl?: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        variant?: { image?: { url: string; altText: string | null } | null } | null;
      };
    }>;
  };
}

export interface CustomerData {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  defaultAddress?: CustomerAddress | null;
  addresses: { edges: Array<{ node: CustomerAddress }> };
  orders: { edges: Array<{ node: CustomerOrder }> };
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

const TOKEN_CREATE = `
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken { accessToken expiresAt }
      customerUserErrors { code field message }
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

const CUSTOMER_CREATE = `
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email firstName lastName }
      customerUserErrors { code field message }
    }
  }
`;

export interface AccessToken {
  accessToken: string;
  expiresAt: string;
}

export async function customerLogin(email: string, password: string): Promise<
  { ok: true; token: AccessToken } | { ok: false; error: string }
> {
  const res = await storefrontApiRequest(TOKEN_CREATE, { input: { email, password } });
  const payload = (res?.data as any)?.customerAccessTokenCreate;
  const err = payload?.customerUserErrors?.[0]?.message;
  const token = payload?.customerAccessToken;
  if (err || !token) return { ok: false, error: err || "Login failed" };
  return { ok: true, token };
}

export async function customerRegister(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await storefrontApiRequest(CUSTOMER_CREATE, { input });
  const payload = (res?.data as any)?.customerCreate;
  const err = payload?.customerUserErrors?.[0]?.message;
  if (err) return { ok: false, error: err };
  return { ok: true };
}

export async function customerLogout(token: string) {
  await storefrontApiRequest(TOKEN_DELETE, { token }).catch(() => undefined);
}

export async function fetchCustomer(token: string): Promise<CustomerData | null> {
  const res = await storefrontApiRequest(CUSTOMER_QUERY, { token });
  return ((res?.data as any)?.customer ?? null) as CustomerData | null;
}
