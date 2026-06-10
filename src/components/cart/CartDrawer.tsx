import { ExternalLink, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatMoney } from "@/lib/shopify";

export function CartDrawer() {
  const {
    isOpen,
    setOpen,
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
  } = useCartStore();

  const totalItems = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce(
    (n, i) => n + parseFloat(i.price.amount) * i.quantity,
    0,
  );
  const currency = items[0]?.price.currencyCode ?? "INR";

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Your bag</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" strokeWidth={1.25} />
            <p className="text-muted-foreground">Nothing here yet</p>
          </div>
        ) : (
          <>
            <div className="-mx-6 flex-1 overflow-y-auto px-6">
              <ul className="divide-y">
                {items.map((item) => {
                  const img = item.product.node.images.edges[0]?.node;
                  return (
                    <li key={item.variantId} className="flex gap-4 py-4">
                      <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden rounded bg-muted">
                        {img && (
                          <img
                            src={img.url}
                            alt={img.altText ?? item.product.node.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium line-clamp-2">
                          {item.product.node.title}
                        </div>
                        {item.selectedOptions.length > 0 && (
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {item.selectedOptions.map((o) => o.value).join(" · ")}
                          </div>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-md border">
                            <button
                              className="p-1.5 hover:bg-muted disabled:opacity-50"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              disabled={isLoading}
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              className="p-1.5 hover:bg-muted disabled:opacity-50"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              disabled={isLoading}
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-sm font-semibold">
                            {formatMoney({
                              amount: (
                                parseFloat(item.price.amount) * item.quantity
                              ).toString(),
                              currencyCode: item.price.currencyCode,
                            })}
                          </div>
                        </div>
                      </div>
                      <button
                        className="self-start p-1 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.variantId)}
                        disabled={isLoading}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  {formatMoney({ amount: subtotal.toString(), currencyCode: currency })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading || isSyncing}
              >
                {isLoading || isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Checkout <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
