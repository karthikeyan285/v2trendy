/** KwikPass Custom Headless configuration (client-safe). */

export const KWIKPASS_MID =
  (import.meta.env.VITE_KWIKPASS_MERCHANT_ID as string | undefined) ||
  (import.meta.env.VITE_GOKWIK_MERCHANT_ID as string | undefined) ||
  "763gimmua0xu2";

export const KWIKPASS_ENV: "production" | "sandbox" =
  import.meta.env.VITE_KWIKPASS_ENVIRONMENT === "sandbox"
    ? "sandbox"
    : "production";

/** Object required by kp-custom-merchant.js — must exist on window before SDK loads. */
export const KWIKPASS_MERCHANT_INFO = {
  mid: KWIKPASS_MID,
  environment: KWIKPASS_ENV,
  type: "merchantInfo",
  integrationType: "CUSTOM_HEADLESS",
} as const;

export function isKwikPassConfigured(): boolean {
  return Boolean(KWIKPASS_MID);
}

export function normalizeIndianPhone(raw: string): {
  ok: true;
  phone: string;
  countryCode: string;
} | {
  ok: false;
  error: string;
} {
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
