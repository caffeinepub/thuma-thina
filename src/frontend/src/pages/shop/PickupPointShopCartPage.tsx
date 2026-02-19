import { useCart } from '@/components/shop/cart/CartProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { navigate } from '@/router/HashRouter';

export function PickupPointShopCartPage() {
  const { items, removeItem, updateQuantity, getTotalAmount, clearCart } = useCart();

  const formatPrice = (price: number) => `R ${price.toFixed(2)}`;

  if (items.length === 0) {
    return (
      <div className="container-custom py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Cart is empty</CardTitle>
            <CardDescription>Add products to the customer's order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={() => navigate('/pickup-point-shop')} className="w-full">
              Browse Products
            </Button>
            <Button variant="outline" onClick={() => navigate('/pickup-point-dashboard')} className="w-full">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Button variant="ghost" onClick={() => navigate('/pickup-point-shop')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Button>

      <h1 className="text-3xl font-bold mb-8">Customer Order Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.listingId}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.productName}</h3>
                    <p className="text-sm text-muted-foreground">from {item.retailerName}</p>
                    <p className="text-lg font-bold text-primary mt-2">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.listingId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          updateQuantity(item.listingId, val);
                        }
                      }}
                      className="w-16 text-center"
                      min={1}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.listingId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => removeItem(item.listingId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal: {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={clearCart} className="w-full">
            Clear Cart
          </Button>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(getTotalAmount())}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={() => navigate('/pickup-point-checkout')}>
                Proceed to Checkout
              </Button>

              <Button variant="outline" className="w-full" onClick={() => navigate('/pickup-point-shop')}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
