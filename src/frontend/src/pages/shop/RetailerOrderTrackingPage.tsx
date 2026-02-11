import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShoppingBag, AlertCircle, ArrowLeft } from 'lucide-react';
import { useGetMyRetailerOrders } from '@/hooks/useRetailerPortal';
import { navigate } from '@/router/HashRouter';
import { formatZAR } from '@/utils/money';
import { formatICTime } from '@/utils/time';
import type { OrderStatus } from '@/backend';

export function RetailerOrderTrackingPage() {
  const { data: orders, isLoading, error } = useGetMyRetailerOrders();

  const getStatusBadge = (status: OrderStatus) => {
    if ('pending' in status) {
      return <Badge variant="secondary">Pending</Badge>;
    } else if ('assigned' in status) {
      return <Badge variant="default">Assigned</Badge>;
    } else if ('purchased' in status) {
      return <Badge variant="default">Purchased</Badge>;
    } else if ('ready' in status) {
      return <Badge variant="default">Ready</Badge>;
    } else if ('inDelivery' in status) {
      return <Badge variant="default">In Delivery</Badge>;
    } else if ('delivered' in status) {
      return <Badge variant="outline">Delivered</Badge>;
    } else if ('cancelled' in status) {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  if (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You are not associated with any retailer. Please contact an administrator to link your account to a
            retailer.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
            <p className="text-muted-foreground">Track orders containing your products</p>
          </div>
          <Button onClick={() => navigate('/retailer')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Orders that include items from your store</CardDescription>
          </CardHeader>
          <CardContent>
            {!orders || orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No orders yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Orders containing your products will appear here
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={Number(order.id)}>
                      <TableCell className="font-mono">#{Number(order.id)}</TableCell>
                      <TableCell>{formatICTime(order.createdAt)}</TableCell>
                      <TableCell>{formatZAR(order.totalAmount)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{formatICTime(order.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
