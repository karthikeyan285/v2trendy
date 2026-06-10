// Bootstraps the KwikPass Custom Headless SDK and pipes login events into the customer store.
import { useEffect } from "react";
import { toast } from "sonner";
import {
  applyMerchantInfo,
  initKwikPass,
  onKwikPassLoginSuccess,
  isKwikPassConfigured,
} from "@/lib/kwikpass";
import { useCustomerStore } from "@/stores/customerStore";

export function useKwikPassBootstrap() {
  const setToken = useCustomerStore((s) => s.setToken);

  useEffect(() => {
    if (!isKwikPassConfigured()) {
      console.warn(
        "[KwikPass] Merchant ID missing. Set VITE_KWIKPASS_MERCHANT_ID in .env.",
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
