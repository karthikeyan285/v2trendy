import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { fetchProductByHandle, formatMoney } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/products/$handle")({
  head: ({ params }) => ({
    meta: [{ title: `${params.handle.replace(/-/g, " ")} — V2 Trendy` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const q = useQuery({
    queryKey: ["product", handle],
    queryFn: () => fetchProductByHandle(handle),
    staleTime: 60_000,
  });

  const product = q.data;
  const variants = useMemo(
    () => product?.variants.edges.map((e) => e.node) ?? [],
    [product],
  );

  const [selected, setSelected] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  // Initialize default selection from first available variant
  const initOnce = useMemo(() => {
    if (!product) return false;
    if (Object.keys(selected).length > 0) return true;
    const v = variants.find((v) => v.availableForSale) ?? variants[0];
    if (!v) return true;
    const map: Record<string, string> = {};
    v.selectedOptions.forEach((o) => (map[o.name] = o.value));
    setSelected(map);
    return true;
  }, [product, variants, selected]);
  void initOnce;

  const currentVariant = useMemo(() => {
    if (!product) return null;
    return (
      variants.find((v) =>
        v.selectedOptions.every((o) => selected[o.name] === o.value),
      ) ?? null
    );
  }, [variants, selected, product]);

  if (q.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[3/4] animate-pulse rounded bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl">Product not found</h1>
        <Link to="/collections" className="mt-4 inline-block text-sm text-brand hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const images = product.images.edges.map((e) => e.node);
  const main = images[activeImg] ?? images[0];
  const price = currentVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt =
    currentVariant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);
  const available = currentVariant?.availableForSale ?? false;

  const handleAdd = async () => {
    if (!currentVariant) {
      toast.error("Please select your options");
      return;
    }
    await addItem({
      product: { node: product },
      variantId: currentVariant.id,
      variantTitle: currentVariant.title,
      price: currentVariant.price,
      quantity: qty,
      selectedOptions: currentVariant.selectedOptions,
    });
    toast.success("Added to bag", { description: product.title });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <nav className="mb-4 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-1">/</span>
        <Link to="/collections" className="hover:text-foreground">Shop</Link>
        <span className="mx-1">/</span>
        <span className="text-foreground line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] overflow-hidden rounded bg-muted">
            {main && (
              <img
                src={main.url}
                alt={main.altText ?? product.title}
                className="h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-[3/4] overflow-hidden rounded border-2 transition ${
                    i === activeImg ? "border-brand" : "border-transparent"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.vendor && (
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {product.vendor}
            </p>
          )}
          <h1 className="mt-1 font-serif text-3xl leading-tight">{product.title}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatMoney(price)}</span>
            {onSale && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatMoney(compareAt)}
                </span>
                <span className="rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                  Save{" "}
                  {Math.round(
                    (1 - parseFloat(price.amount) / parseFloat(compareAt!.amount)) *
                      100,
                  )}
                  %
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Inclusive of all taxes
          </p>

          {/* Options */}
          {product.options.map((opt) => {
            if (opt.values.length <= 1) return null;
            return (
              <div key={opt.name} className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">{opt.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {selected[opt.name] ?? "Select"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {opt.values.map((val) => {
                    const isActive = selected[opt.name] === val;
                    // Check if any variant with this option combination is available
                    const candidate = variants.find((v) =>
                      v.selectedOptions.every((o) =>
                        o.name === opt.name
                          ? o.value === val
                          : selected[o.name]
                            ? selected[o.name] === o.value
                            : true,
                      ),
                    );
                    const disabled = candidate ? !candidate.availableForSale : true;
                    return (
                      <button
                        key={val}
                        onClick={() =>
                          setSelected((s) => ({ ...s, [opt.name]: val }))
                        }
                        disabled={disabled}
                        className={`min-w-[3rem] rounded-md border px-3 py-2 text-sm transition ${
                          isActive
                            ? "border-brand bg-brand text-brand-foreground"
                            : "hover:border-foreground"
                        } ${disabled ? "opacity-40 line-through" : ""}`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Quantity */}
          <div className="mt-6">
            <span className="text-sm font-semibold">Quantity</span>
            <div className="mt-2 inline-flex items-center rounded-md border">
              <button
                className="p-2 hover:bg-muted disabled:opacity-50"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                className="p-2 hover:bg-muted"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAdd}
              disabled={isLoading || !available}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !available ? (
                "Sold out"
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to bag
                </>
              )}
            </Button>
          </div>

          {/* Description */}
          {product.descriptionHtml ? (
            <div
              className="prose prose-sm mt-10 max-w-none text-foreground/80"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />
          ) : product.description ? (
            <p className="mt-10 whitespace-pre-line text-sm text-foreground/80">
              {product.description}
            </p>
          ) : null}

          <ul className="mt-10 grid grid-cols-2 gap-4 border-t pt-6 text-xs text-muted-foreground">
            <li>✓ Free shipping on prepaid orders</li>
            <li>✓ 7-day easy returns</li>
            <li>✓ Premium quality fabrics</li>
            <li>✓ Secure checkout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
