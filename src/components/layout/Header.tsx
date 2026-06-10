import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export function Header() {
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);
  const [mobileOpen, setMobileOpen] = useState(false);

  const close = () => setMobileOpen(false);

  const navLinkClass = "hover:text-accent transition-colors";
  const activeNav = { className: "text-accent" };

  return (
    <header className="sticky top-0 z-40 bg-brand text-brand-foreground shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <button
          className="lg:hidden -ml-2 p-2"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-2xl font-bold tracking-wide text-accent">V2</span>
          <span className="font-serif text-lg sm:text-xl tracking-[0.2em] uppercase">Trendy</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium uppercase tracking-wider">
          <Link to="/collections" className={navLinkClass} activeProps={activeNav}>New Arrival</Link>
          <Link to="/collections/$handle" params={{ handle: "co-ord-set" }} className={navLinkClass} activeProps={activeNav}>Co-ord Set</Link>
          <Link to="/collections/$handle" params={{ handle: "ethnic-wear" }} className={navLinkClass} activeProps={activeNav}>Ethnic Wear</Link>
          <Link to="/collections/$handle" params={{ handle: "tunics" }} className={navLinkClass} activeProps={activeNav}>Tunics</Link>
          <Link to="/collections" className={navLinkClass}>All</Link>
        </nav>

        <div className="flex items-center gap-1">
          <Link to="/collections" aria-label="Search" className="p-2 hover:text-accent transition-colors">
            <Search className="h-5 w-5" />
          </Link>
          <Link to="/account" aria-label="Account" className="p-2 hover:text-accent transition-colors hidden sm:inline-flex">
            <User className="h-5 w-5" />
          </Link>
          <button aria-label="Open cart" onClick={openCart} className="relative p-2 hover:text-accent transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/60" onClick={close} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-background text-foreground shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <span className="font-serif text-xl">Menu</span>
              <button onClick={close} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-2">
              <Link to="/collections" onClick={close} className="px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md">New Arrival</Link>
              <Link to="/collections/$handle" params={{ handle: "co-ord-set" }} onClick={close} className="px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md">Co-ord Set</Link>
              <Link to="/collections/$handle" params={{ handle: "ethnic-wear" }} onClick={close} className="px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md">Ethnic Wear</Link>
              <Link to="/collections/$handle" params={{ handle: "tunics" }} onClick={close} className="px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md">Tunics</Link>
              <Link to="/collections" onClick={close} className="px-4 py-3 text-sm uppercase tracking-wider hover:bg-muted rounded-md">All Products</Link>
              <div className="border-t mt-2 pt-2 flex flex-col">
                <Link to="/account" onClick={close} className="px-4 py-3 text-sm hover:bg-muted rounded-md">My Account</Link>
                <Link to="/account/orders" onClick={close} className="px-4 py-3 text-sm hover:bg-muted rounded-md">My Orders</Link>
              </div>
            </nav>
            <div className="mt-auto p-4">
              <Button asChild className="w-full">
                <Link to="/login" onClick={close}>Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
