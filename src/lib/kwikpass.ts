// KwikPass (GoKwik) Custom Headless integration.
// Docs: set window.merchantInfo, load kp-custom-merchant.js, use
// window.__KP_LOGIN_SDK_INSTANCE__ for OTP send/verify/logout.

import type { AccessToken } from "./shopify-customer";
import {
  KWIKPASS_ENV,
  KWIKPASS_MID,
  KWIKPASS_MERCHANT_INFO,
  isKwikPassConfigured,
  normalizeIndianPhone,
} from "./gokwik-config";

export {
  KWIKPASS_ENV,
  KWIKPASS_MID,
  KWIKPASS_MERCHANT_INFO,
  isKwikPassConfigured,
  normalizeIndianPhone,
};

const SDK_URLS = {
  sandbox:
    "https://sandbox.pdp.gokwik.co/kwikpass/plugin/build/kp-custom-merchant.js",
  production:
    "https://pdp.gokwik.co/kwikpass/plugin/build/kp-custom-merchant.js",
} as const;

interface KwikPassVerifyData {
  email?: string;
  token?: string;
  coreToken?: string;
  kpToken?: string;
  customerAccessToken?: string;
  shopifyCustomerAccessToken?: string;
  expiresAt?: string;
  expires_at?: string;
}

interface KwikPassLoginSdk {
  kpSendOTP: (
    phone: string,
  ) => Promise<{ status: number; message?: string; error?: string }>;
  kpVerifyOTP: (input: {
    phone: string;
    otp: string;
  }) => Promise<{
    status: number;
    message?: string;
    error?: string;
    body?: { data?: KwikPassVerifyData };
    data?: KwikPassVerifyData;
  }>;
  handleKPLogout: () => Promise<void> | void;
}

declare global {
  interface Window {
    merchantInfo?: {
      mid: string;
      environment: string;
      type: string;
      integrationType: string;
    };
    __KP_LOGIN_SDK_INSTANCE__?: KwikPassLoginSdk;
  }
}

let loadPromise: Promise<KwikPassLoginSdk> | null = null;

export class KwikPassError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "KwikPassError";
  }
}

function sdkUrl(): string {
  return SDK_URLS[KWIKPASS_ENV];
}

/** Drop SDK loaded for a different environment (e.g. after switching sandbox → production). */
function removeStaleSdkScripts(): void {
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

/**
 * Apply merchant config to window. Must run before kp-custom-merchant.js executes.
 * Safe to call multiple times (idempotent).
 */
export function applyMerchantInfo(): void {
  if (typeof window === "undefined") return;
  window.merchantInfo = { ...KWIKPASS_MERCHANT_INFO };
}

function assertMerchantInfoReady(): void {
  if (!window.merchantInfo?.mid) {
    throw new KwikPassError(
      "window.merchantInfo must be set before loading the KwikPass SDK.",
      "merchant_info_missing",
    );
  }
}

function loadScript(): Promise<void> {
  applyMerchantInfo();
  assertMerchantInfoReady();
  removeStaleSdkScripts();

  if (import.meta.env.DEV && KWIKPASS_ENV === "sandbox") {
    console.warn(
      "[KwikPass] Sandbox mode uses api-gw-v4.dev.gokwik.io — live merchants often 404. Set VITE_KWIKPASS_ENVIRONMENT=production for v2trendy.",
    );
  }

  const url = sdkUrl();
  return new Promise<void>((resolve, reject) => {
    let existing = document.querySelector(
      `script[src="${url}"]`,
    ) as HTMLScriptElement | null;

    // Script ran without merchantInfo — remove and reload.
    if (
      existing?.dataset.loaded === "true" &&
      !window.__KP_LOGIN_SDK_INSTANCE__
    ) {
      existing.remove();
      existing = null;
    }

    if (existing) {
      if (existing.dataset.loaded === "true") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new KwikPassError("KwikPass SDK failed to load.", "sdk_load")),
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
    s.onerror = () =>
      reject(new KwikPassError("KwikPass SDK failed to load.", "sdk_load"));
    document.head.appendChild(s);
  });
}

async function waitForSdkInstance(timeoutMs = 15000): Promise<KwikPassLoginSdk> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const instance = window.__KP_LOGIN_SDK_INSTANCE__;
    if (
      instance &&
      typeof instance.kpSendOTP === "function" &&
      typeof instance.kpVerifyOTP === "function"
    ) {
      return instance;
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  throw new KwikPassError(
    "KwikPass SDK did not initialize in time.",
    "sdk_timeout",
  );
}

async function getSdkInstance(): Promise<KwikPassLoginSdk> {
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
        sdkInstance: window.__KP_LOGIN_SDK_INSTANCE__,
      });
      return instance;
    })();
  }
  return loadPromise;
}

/** Load the official KwikPass Custom Headless SDK. */
export async function initKwikPass(): Promise<boolean> {
  try {
    applyMerchantInfo();
    await getSdkInstance();
    return true;
  } catch (err) {
    console.error("[KwikPass] init failed", err);
    return false;
  }
}

/** Send OTP via the official SDK. */
export async function sendKwikPassOtp(phone: string): Promise<void> {
  const parsed = normalizeIndianPhone(phone);
  if (!parsed.ok) throw new KwikPassError(parsed.error, "invalid_phone");

  const sdk = await getSdkInstance();
  let res: { status: number; message?: string; error?: string };
  try {
    res = await sdk.kpSendOTP(parsed.phone);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/404|not found/i.test(msg) && KWIKPASS_ENV === "sandbox") {
      throw new KwikPassError(
        "OTP API not found in sandbox. This merchant is likely production-only — set VITE_KWIKPASS_ENVIRONMENT=production and restart.",
        "sandbox_404",
      );
    }
    throw new KwikPassError(msg || "Failed to send OTP.", "send_otp");
  }

  if (res.status !== 200) {
    const hint =
      res.status === 404 && KWIKPASS_ENV === "sandbox"
        ? " Sandbox API returned 404 — switch to VITE_KWIKPASS_ENVIRONMENT=production."
        : "";
    throw new KwikPassError(
      (res.message ?? res.error ?? "Failed to send OTP.") + hint,
      "send_otp",
    );
  }
}

/** Verify OTP and return a Shopify Storefront customer access token. */
export async function verifyKwikPassOtp(input: {
  phone: string;
  otp: string;
}): Promise<AccessToken> {
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
      "verify_otp",
    );
  }

  const data = res.body?.data ?? res.data;
  const accessToken =
    data?.customerAccessToken ??
    data?.shopifyCustomerAccessToken ??
    data?.token;

  if (!accessToken) {
    throw new KwikPassError(
      "OTP verified but no customer token was returned.",
      "missing_token",
    );
  }

  return {
    accessToken,
    expiresAt:
      data?.expiresAt ??
      data?.expires_at ??
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/** Logout via the official SDK. */
export async function kwikPassLogout(): Promise<void> {
  try {
    const sdk = window.__KP_LOGIN_SDK_INSTANCE__;
    if (sdk?.handleKPLogout) await sdk.handleKPLogout();
  } catch {
    /* ignore */
  }
}

/**
 * Subscribe to SDK login events (e.g. SSO re-login).
 * Returns an unsubscribe function.
 */
export function onKwikPassLoginSuccess(
  cb: (token: AccessToken, raw: unknown) => void,
): () => void {
  const handle = (raw: unknown) => {
    const token = extractAccessToken(raw);
    if (token) cb(token, raw);
  };

  const winHandler = (e: Event) => handle((e as CustomEvent).detail ?? {});

  const events = [
    "kp-login-success",
    "kwikpass:login",
    "kwikpass:login:success",
    "kp:auth:success",
    "user-loggedin",
  ];
  events.forEach((ev) => window.addEventListener(ev, winHandler));

  if (isKwikPassConfigured()) {
    initKwikPass().catch(() => undefined);
  }

  return () => {
    events.forEach((ev) => window.removeEventListener(ev, winHandler));
  };
}

function extractAccessToken(raw: unknown): AccessToken | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const candidates = [
    r.customerAccessToken,
    r.shopifyCustomerAccessToken,
    r.token,
    r["gk-access-token"],
    (r.data as Record<string, unknown> | undefined)?.token,
    (r.data as Record<string, unknown> | undefined)?.customerAccessToken,
  ].filter(Boolean);

  for (const c of candidates) {
    if (typeof c === "string") {
      return { accessToken: c, expiresAt: defaultExpiry() };
    }
    if (
      c &&
      typeof c === "object" &&
      typeof (c as { accessToken?: string }).accessToken === "string"
    ) {
      const t = c as { accessToken: string; expiresAt?: string };
      return {
        accessToken: t.accessToken,
        expiresAt: t.expiresAt ?? defaultExpiry(),
      };
    }
  }
  return null;
}

function defaultExpiry(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}
