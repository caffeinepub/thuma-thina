import { useListOrdersByCustomer } from '@/hooks/useOrders';
import { useListMyPickupOrders } from '@/hooks/usePickupPointOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package, Eye, Store } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { formatICTime } from '@/utils/time';
import { formatZAR } from '@/utils/money';
import type { OrderStatus } from '@/backend';

export function MyOrdersPage() {
  const { data: orders, isLoading, error } = useListOrdersByCustomer();
  const { data: pickupOrders } = useListMyPickupOrders();

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

  const isPickupOrder = (orderId: bigint) => {
    return pickupOrders?.some((po) => po.orderRecord.id === orderId);
  };

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
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>{orders.length} orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={Number(order.id)}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        #{Number(order.id)}
                        {isPickupOrder(order.id) && (
                          <Badge variant="outline" className="text-xs">
                            <Store className="h-3 w-3 mr-1" />
                            Pickup Point
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatICTime(order.createdAt)}</TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell>{formatZAR(order.totalAmount)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/order/${Number(order.id)}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
