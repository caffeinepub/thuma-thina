import { useState } from 'react';
import { useCart } from '@/components/shop/cart/CartProvider';
import { useCreateOrder } from '@/hooks/useOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';

export function CheckoutPage() {
  const { items, getTotalAmount, clearCart } = useCart();
  const createOrder = useCreateOrder();

  const [deliveryType, setDeliveryType] = useState<'home' | 'pickupPoint'>('home');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupPointId, setPickupPointId] = useState('');
  const [paymentType, setPaymentType] = useState<'zar' | 'icp' | 'nomayini'>('zar');

  const formatPrice = (price: number) => `R ${price.toFixed(2)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (deliveryType === 'home' && !deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    if (deliveryType === 'pickupPoint' && !pickupPointId.trim()) {
      toast.error('Please enter a pickup point ID');
      return;
    }

    try {
      await createOrder.mutateAsync({
        items: items.map((item) => ({
          listingId: item.listingId,
          quantity: item.quantity,
        })),
        deliveryType,
        deliveryAddress,
        pickupPointId,
        paymentType,
      });
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    }
  };

  if (items.length === 0 && !createOrder.isSuccess) {
    return (
      <div className="container-custom py-16">
        <Alert>
          <AlertDescription>Your cart is empty. Add items before checking out.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/catalogue')}>
          Browse Catalogue
        </Button>
      </div>
    );
  }

  if (createOrder.isSuccess) {
    return (
      <div className="container-custom py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CheckCircle2 className="h-16 w-16 mx-auto text-primary mb-4" />
            <CardTitle>Order Placed Successfully!</CardTitle>
            <CardDescription>Your order has been received and is being processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate('/my-orders')} className="w-full">
              View My Orders
            </Button>
            <Button variant="outline" onClick={() => navigate('/catalogue')} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryType} onValueChange={(v) => setDeliveryType(v as any)}>
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home">Home Delivery</Label>
                  </div>
                  {deliveryType === 'home' && (
                    <div className="ml-6 mb-4">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Input
                        id="address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                        placeholder="Enter your full address"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickupPoint" id="pickupPoint" />
                    <Label htmlFor="pickupPoint">Pickup Point</Label>
                  </div>
                  {deliveryType === 'pickupPoint' && (
                    <div className="ml-6 mt-2">
                      <Label htmlFor="pickupPointId">Pickup Point ID *</Label>
                      <Input
                        id="pickupPointId"
                        type="number"
                        value={pickupPointId}
                        onChange={(e) => setPickupPointId(e.target.value)}
                        required
                        placeholder="Enter pickup point ID"
                      />
                    </div>
                  )}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentType} onValueChange={(v) => setPaymentType(v as any)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="zar" id="zar" />
                    <Label htmlFor="zar">ZAR (South African Rand)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="icp" id="icp" />
                    <Label htmlFor="icp">ICP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nomayini" id="nomayini" />
                    <Label htmlFor="nomayini">NomaYini Tokens</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.listingId} className="flex justify-between text-sm">
                      <span>
                        {item.productName} x{item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(getTotalAmount())}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={createOrder.isPending}>
                  {createOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                {createOrder.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {createOrder.error?.message || 'Failed to place order. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
