import { Outlet } from "@tanstack/react-router";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";
import { useKwikPassBootstrap } from "@/hooks/useKwikPass";
import { Toaster } from "@/components/ui/sonner";

export function SiteLayout() {
  useCartSync();
  useKwikPassBootstrap();
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="top-center" richColors />
    </div>
  );
}
