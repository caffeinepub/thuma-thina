import { useState } from 'react';
import { useCart } from '@/components/shop/cart/CartProvider';
import { useCreatePickupOrder } from '@/hooks/usePickupPointOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';
import { PaymentMethod } from '@/backend';

export function PickupPointShopCheckoutPage() {
  const { items, getTotalAmount, clearCart } = useCart();
  const createPickupOrder = useCreatePickupOrder();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentType, setPaymentType] = useState<'zar' | 'icp' | 'nomayini'>('zar');

  const formatPrice = (price: number) => `R ${price.toFixed(2)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (!customerPhone.trim()) {
      toast.error('Please enter customer phone number');
      return;
    }

    try {
      await createPickupOrder.mutateAsync({
        items: items.map((item) => ({
          listingId: BigInt(item.listingId),
          quantity: BigInt(item.quantity),
        })),
        paymentMethod: PaymentMethod[paymentType],
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim() || undefined,
      });
      clearCart();
      toast.success('Order created successfully!');
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to create order. Please try again.');
    }
  };

  if (items.length === 0 && !createPickupOrder.isSuccess) {
    return (
      <div className="container-custom py-16">
        <Alert>
          <AlertDescription>Cart is empty. Add items before checking out.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/pickup-point-shop')}>
          Browse Products
        </Button>
      </div>
    );
  }

  if (createPickupOrder.isSuccess) {
    return (
      <div className="container-custom py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CheckCircle2 className="h-16 w-16 mx-auto text-primary mb-4" />
            <CardTitle>Order Created Successfully!</CardTitle>
            <CardDescription>The customer's order has been placed and is being processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate('/pickup-point-dashboard')} className="w-full">
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/pickup-point-shop')} className="w-full">
              Create Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Button variant="ghost" onClick={() => navigate('/pickup-point-cart')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <h1 className="text-3xl font-bold mb-8">Customer Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Enter the walk-in customer's details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="Enter customer's full name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Customer Phone *</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                    placeholder="Enter customer's phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address (Optional)</Label>
                  <Input
                    id="deliveryAddress"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Leave blank to use pickup point address"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    If left blank, the order will be delivered to your pickup point location
                  </p>
                </div>
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
                      <span className="text-muted-foreground">
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

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={createPickupOrder.isPending}
                >
                  {createPickupOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    'Create Order'
                  )}
                </Button>

                {createPickupOrder.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {createPickupOrder.error?.message || 'Failed to create order'}
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
