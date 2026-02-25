import React from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/components/shop/cart/CartProvider';

export function PickupPointShopCartPage() {
  const { items, removeItem, clearCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          Pickup Point Cart
        </h1>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checkout Unavailable</AlertTitle>
        <AlertDescription>
          Pickup point checkout is not available in the current backend version.
        </AlertDescription>
      </Alert>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Your cart is empty</p>
            <Button
              className="mt-4"
              onClick={() => (window.location.hash = '#/pickup-point/shop')}
            >
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-4">
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.listingId.toString()}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.listingId)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PickupPointShopCartPage;
