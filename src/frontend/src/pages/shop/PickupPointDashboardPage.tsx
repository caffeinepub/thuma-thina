import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Store, ShoppingCart, Package, Eye, Info } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { useListMyPickupOrders } from '@/hooks/usePickupPointOrders';
import type { OrderStatus } from '@/backend';

export function PickupPointDashboardPage() {
  const { data: pickupOrders, isLoading, error } = useListMyPickupOrders();

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

  return (
    <div className="container-custom py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pickup Point Dashboard</h1>
        <p className="text-muted-foreground">
          Manage orders and shop on behalf of walk-in customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle>Walk-in Customer Orders</CardTitle>
          </div>
          <CardDescription>
            Create orders for customers who visit your pickup point
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/pickup-point-shop')} size="lg" className="w-full sm:w-auto">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Start Walk-in Order
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Your Orders</CardTitle>
          </div>
          <CardDescription>
            View and manage all orders created at your pickup point
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>Failed to load orders. Please try again.</AlertDescription>
            </Alert>
          ) : !pickupOrders || pickupOrders.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No orders yet. Start creating orders for your walk-in customers using the button above.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pickupOrders.map((pickupOrder) => (
                    <TableRow key={Number(pickupOrder.orderRecord.id)}>
                      <TableCell className="font-medium">
                        #{Number(pickupOrder.orderRecord.id)}
                      </TableCell>
                      <TableCell>{pickupOrder.customerName}</TableCell>
                      <TableCell>{getStatusBadge(pickupOrder.orderRecord.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/order/${Number(pickupOrder.orderRecord.id)}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
