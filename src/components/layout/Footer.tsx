import { Link } from "@tanstack/react-router";
import { Leaf, RefreshCw, Shield, Truck } from "lucide-react";

const USPS = [
  { icon: Shield, title: "Premium Fabrics", sub: "Authentic quality textiles" },
  { icon: Truck, title: "Free Shipping", sub: "On all prepaid orders" },
  { icon: RefreshCw, title: "Easy Returns", sub: "7-day return policy" },
  { icon: Leaf, title: "Sustainable", sub: "Eco-friendly production" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary/50">
      {/* USP strip */}
      <div className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 lg:px-6">
          {USPS.map((u) => (
            <div key={u.title} className="flex items-start gap-3">
              <u.icon className="h-6 w-6 shrink-0 text-brand" strokeWidth={1.5} />
              <div>
                <div className="text-sm font-semibold">{u.title}</div>
                <div className="text-xs text-muted-foreground">{u.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-accent">V2</span>
            <span className="font-serif text-lg uppercase tracking-[0.2em]">Trendy</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Garments crafted with passion. Premium Indian ethnic wear for the modern woman.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/collections" className="hover:text-foreground">All Products</Link></li>
            <li><Link to="/collections/$handle" params={{ handle: "co-ord-set" }} className="hover:text-foreground">Co-ord Sets</Link></li>
            <li><Link to="/collections/$handle" params={{ handle: "ethnic-wear" }} className="hover:text-foreground">Ethnic Wear</Link></li>
            <li><Link to="/collections/$handle" params={{ handle: "tunics" }} className="hover:text-foreground">Tunics</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Account</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/login" className="hover:text-foreground">Sign in</Link></li>
            <li><Link to="/register" className="hover:text-foreground">Create account</Link></li>
            <li><Link to="/account/orders" className="hover:text-foreground">Track order</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider">Help</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Shipping &amp; returns</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row lg:px-6">
          <span>© {new Date().getFullYear()} V2 Trendy. All rights reserved.</span>
          <span>Secure checkout powered by Shopify</span>
        </div>
      </div>
    </footer>
  );
}
