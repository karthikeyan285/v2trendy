import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Scripts,
  useRouter,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteLayout } from "@/components/layout/SiteLayout";
import {
  KWIKPASS_MERCHANT_INFO,
  isKwikPassConfigured,
} from "@/lib/gokwik-config";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl">404</h1>
        <h2 className="mt-4 font-serif text-xl">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please try again or head back to the homepage.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "V2 Trendy — Premium Indian Ethnic Wear" },
      {
        name: "description",
        content:
          "Shop premium kurtas, co-ord sets, ethnic wear and tunics. Garments crafted with passion.",
      },
      { property: "og:title", content: "V2 Trendy — Premium Indian Ethnic Wear" },
      {
        property: "og:description",
        content: "Premium kurtas, co-ord sets, ethnic wear and tunics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "V2 Trendy — Premium Indian Ethnic Wear" },
      { name: "description", content: "A premium, scalable Shopify storefront rebuilt for enhanced user experience and conversion." },
      { property: "og:description", content: "A premium, scalable Shopify storefront rebuilt for enhanced user experience and conversion." },
      { name: "twitter:description", content: "A premium, scalable Shopify storefront rebuilt for enhanced user experience and conversion." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5f200a16-b993-43fb-becf-be5e92eebae0/id-preview-5e2d5e24--7cb274cc-2d93-4dfe-96bb-ae2d3bada4b9.lovable.app-1779347477070.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5f200a16-b993-43fb-becf-be5e92eebae0/id-preview-5e2d5e24--7cb274cc-2d93-4dfe-96bb-ae2d3bada4b9.lovable.app-1779347477070.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap",
      },
      { rel: "preconnect", href: "https://v2trendy.myshopify.com" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  const merchantInfoScript = isKwikPassConfigured()
    ? `window.merchantInfo=${JSON.stringify(KWIKPASS_MERCHANT_INFO)};console.log("[KwikPass] merchantInfo configured",window.merchantInfo);`
    : "";

  return (
    <html lang="en">
      <head>
        {merchantInfoScript ? (
          <script dangerouslySetInnerHTML={{ __html: merchantInfoScript }} />
        ) : null}
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteLayout />
    </QueryClientProvider>
  );
}
