import { useGetOrder } from '@/hooks/useOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { formatICDateTime } from '@/utils/time';
import { formatZAR } from '@/utils/money';
import { PaymentMethod } from '@/backend';
import type { OrderStatus, DeliveryMethod } from '@/backend';

interface OrderDetailPageProps {
  orderId: number;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const { data: order, isLoading, error } = useGetOrder(orderId);

  const getStatusBadge = (status: OrderStatus) => {
    if (status.__kind__ === 'pending') {
      return <Badge variant="secondary">Pending</Badge>;
    } else if (status.__kind__ === 'assigned') {
      return <Badge variant="default">Assigned</Badge>;
    } else if (status.__kind__ === 'purchased') {
      return <Badge variant="default">Purchased</Badge>;
    } else if (status.__kind__ === 'ready') {
      return <Badge variant="default">Ready</Badge>;
    } else if (status.__kind__ === 'inDelivery') {
      return <Badge variant="default">In Delivery</Badge>;
    } else if (status.__kind__ === 'delivered') {
      return <Badge variant="outline">Delivered</Badge>;
    } else if (status.__kind__ === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getDeliveryMethodText = (method: DeliveryMethod) => {
    if (method.__kind__ === 'home') {
      return `Home Delivery: ${method.home.address}`;
    } else if (method.__kind__ === 'pickupPoint') {
      return `Pickup Point #${method.pickupPoint.pointId}`;
    }
    return 'Unknown';
  };

  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.zar:
        return 'ZAR (South African Rand)';
      case PaymentMethod.icp:
        return 'ICP';
      case PaymentMethod.nomayini:
        return 'NomaYini Tokens';
      default:
        return 'Unknown';
    }
  };

  if (error || (!isLoading && !order)) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertDescription>Order not found or failed to load.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate('/my-orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <Button variant="ghost" onClick={() => navigate('/my-orders')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>

      {isLoading ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : order ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Order #{Number(order.id)}
                  </CardTitle>
                  <CardDescription>Placed on {formatICDateTime(order.createdAt)}</CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">Listing #{Number(item.listingId)}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {Number(item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Delivery Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </h3>
                <p className="text-sm">{getDeliveryMethodText(order.deliveryMethod)}</p>
              </div>

              <Separator />

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </h3>
                <p className="text-sm">{getPaymentMethodText(order.paymentMethod)}</p>
              </div>

              <Separator />

              {/* Order Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary">{formatZAR(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
