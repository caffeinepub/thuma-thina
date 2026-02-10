import { useListOrdersByCustomer } from '@/hooks/useOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Info } from 'lucide-react';
import { navigate } from '@/router/HashRouter';

export function MyOrdersPage() {
  const { data: orders, isLoading, error } = useListOrdersByCustomer();

  if (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load orders. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Order history will be available once the backend is fully implemented.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No orders yet</p>
            <p className="text-muted-foreground mb-6">Start shopping to place your first order</p>
            <Button onClick={() => navigate('/catalogue')}>Browse Catalogue</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
