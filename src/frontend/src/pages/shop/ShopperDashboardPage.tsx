import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePlacedOrders, useAcceptOrder, useMarkShoppingDone } from '../../hooks/useQueries';
import { ShoppingCart, Loader2, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { formatZAR } from '../../utils/money';

export function ShopperDashboardPage() {
  const { data: placedOrders, isLoading } = usePlacedOrders();
  const acceptOrderMutation = useAcceptOrder();
  const markDoneMutation = useMarkShoppingDone();

  const handleAccept = async (orderId: bigint) => {
    try {
      await acceptOrderMutation.mutateAsync(orderId);
    } catch (error: any) {
      console.error('Error accepting order:', error);
    }
  };

  const handleMarkDone = async (orderId: bigint) => {
    try {
      await markDoneMutation.mutateAsync(orderId);
    } catch (error: any) {
      console.error('Error marking order done:', error);
    }
  };

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Shopper Dashboard
          </h1>
          <p className="text-muted-foreground">
            View and process customer orders
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Placed Orders
            </CardTitle>
            <CardDescription>
              Orders waiting to be processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !placedOrders || placedOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground text-lg">No orders waiting to be processed</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placedOrders.map((order: any) => (
                    <TableRow key={order.id.toString()}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.toString().slice(0, 8)}
                      </TableCell>
                      <TableCell>{order.customerName || 'Customer'}</TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
                      <TableCell className="font-semibold">
                        {formatZAR(order.total || BigInt(0))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'placed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === 'placed' ? (
                          <Button
                            size="sm"
                            onClick={() => handleAccept(order.id)}
                            disabled={acceptOrderMutation.isPending}
                          >
                            {acceptOrderMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Accept'
                            )}
                          </Button>
                        ) : order.status === 'shopping' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkDone(order.id)}
                            disabled={markDoneMutation.isPending}
                          >
                            {markDoneMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Done
                              </>
                            )}
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {(acceptOrderMutation.isError || markDoneMutation.isError) && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {acceptOrderMutation.error?.message || markDoneMutation.error?.message || 'An error occurred'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
