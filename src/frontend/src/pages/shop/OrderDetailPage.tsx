import { useGetOrder } from '@/hooks/useOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Package } from 'lucide-react';
import { navigate } from '@/router/HashRouter';

interface OrderDetailPageProps {
  orderId: number;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  const { data: order, isLoading, error } = useGetOrder(orderId);

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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6" />
              Order #{orderId}
            </CardTitle>
            <CardDescription>Order details will be available once the backend is implemented</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
