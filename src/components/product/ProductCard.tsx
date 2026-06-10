import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { formatMoney, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: ShopifyProduct }) {
  const node = product.node;
  const img = node.images.edges[0]?.node;
  const hover = node.images.edges[1]?.node ?? img;
  const variant = node.variants.edges[0]?.node;
  const compareAt = node.compareAtPriceRange?.minVariantPrice;
  const price = node.priceRange.minVariantPrice;
  const onSale =
    compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variant) return;
    if (node.options.length > 1 || (node.options[0]?.values.length ?? 0) > 1) {
      // Send to PDP for variant selection
      window.location.href = `/products/${node.handle}`;
      return;
    }
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title ?? "Default",
      price: variant.price,
      quantity: 1,
      selectedOptions: [],
    });
    toast.success("Added to bag", { description: node.title });
  };

  return (
    <Link
      to="/products/$handle"
      params={{ handle: node.handle }}
      className="group block"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded bg-muted">
        {img && (
          <img
            src={img.url}
            alt={img.altText ?? node.title}
            width={img.width ?? 600}
            height={img.height ?? 800}
            className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
        )}
        {hover && (
          <img
            src={hover.url}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            loading="lazy"
          />
        )}
        {onSale && (
          <span className="absolute left-2 top-2 rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-foreground">
            Sale
          </span>
        )}
        {!node.availableForSale && (
          <span className="absolute left-2 top-2 rounded bg-foreground px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
            Sold out
          </span>
        )}
        <div className="absolute inset-x-2 bottom-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            size="sm"
            className="w-full"
            onClick={handleAdd}
            disabled={isLoading || !node.availableForSale}
          >
            {node.availableForSale ? "Quick add" : "Sold out"}
          </Button>
        </div>
      </div>
      <div className="pt-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug">
          {node.title}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-semibold">{formatMoney(price)}</span>
          {onSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatMoney(compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
