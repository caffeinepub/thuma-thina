import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useReadyForDeliveryOrders, useAcceptDelivery, useMarkDelivered } from '../../hooks/useQueries';
import { Truck, Loader2, AlertCircle, CheckCircle2, Package } from 'lucide-react';
import { formatZAR } from '../../utils/money';

export function DriverDashboardPage() {
  const { data: deliveryOrders, isLoading } = useReadyForDeliveryOrders();
  const acceptDeliveryMutation = useAcceptDelivery();
  const markDeliveredMutation = useMarkDelivered();

  const handleAccept = async (orderId: bigint) => {
    try {
      await acceptDeliveryMutation.mutateAsync(orderId);
    } catch (error: any) {
      console.error('Error accepting delivery:', error);
    }
  };

  const handleMarkDelivered = async (orderId: bigint) => {
    try {
      await markDeliveredMutation.mutateAsync(orderId);
    } catch (error: any) {
      console.error('Error marking delivered:', error);
    }
  };

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Driver Dashboard
          </h1>
          <p className="text-muted-foreground">
            View and deliver customer orders
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Ready for Delivery
            </CardTitle>
            <CardDescription>
              Orders ready to be delivered to customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !deliveryOrders || deliveryOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground text-lg">No orders ready for delivery</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryOrders.map((order: any) => (
                    <TableRow key={order.id.toString()}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.toString().slice(0, 8)}
                      </TableCell>
                      <TableCell>{order.customerName || 'Customer'}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {order.deliveryAddress || 'Address not provided'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatZAR(order.total || BigInt(0))}
                      </TableCell>
                      <TableCell>
                        <Badge variant={order.status === 'readyForDelivery' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === 'readyForDelivery' ? (
                          <Button
                            size="sm"
                            onClick={() => handleAccept(order.id)}
                            disabled={acceptDeliveryMutation.isPending}
                          >
                            {acceptDeliveryMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Accept & Collect'
                            )}
                          </Button>
                        ) : order.status === 'outForDelivery' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkDelivered(order.id)}
                            disabled={markDeliveredMutation.isPending}
                          >
                            {markDeliveredMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Delivered
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

            {(acceptDeliveryMutation.isError || markDeliveredMutation.isError) && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {acceptDeliveryMutation.error?.message || markDeliveredMutation.error?.message || 'An error occurred'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
