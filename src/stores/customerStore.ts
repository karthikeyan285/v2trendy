import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AccessToken } from "@/lib/shopify-customer";
import { customerLogout } from "@/lib/shopify-customer";
import { kwikPassLogout } from "@/lib/kwikpass";

interface CustomerStore {
  token: AccessToken | null;
  hasHydrated: boolean;
  setToken: (t: AccessToken) => void;
  setHasHydrated: (v: boolean) => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      token: null,
      hasHydrated: false,
      setToken: (t) => set({ token: t }),
      setHasHydrated: (v) => set({ hasHydrated: v }),
      logout: async () => {
        const t = get().token;
        if (t?.accessToken) await customerLogout(t.accessToken);
        await kwikPassLogout().catch(() => undefined);
        set({ token: null });
      },
      isAuthenticated: () => {
        const t = get().token;
        if (!t) return false;
        return new Date(t.expiresAt).getTime() > Date.now();
      },
    }),
    {
      name: "v2trendy-customer",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
