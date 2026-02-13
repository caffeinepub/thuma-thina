import { useState } from 'react';
import {
  useListShopperEligibleOrders,
  useListMyAssignedShopperOrders,
  useAcceptShopperOrder,
  useCompleteShopperOrder,
  useGetShopperOrderDetails,
} from '@/hooks/useShopperOrders';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatICDateTime } from '@/utils/time';
import { formatZAR } from '@/utils/money';
import { ShoppingBag, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function ShopperDashboardPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: eligibleOrders, isLoading: eligibleLoading } = useListShopperEligibleOrders();
  const { data: assignedOrders, isLoading: assignedLoading } = useListMyAssignedShopperOrders();
  const { data: orderDetails, isLoading: detailsLoading } = useGetShopperOrderDetails(
    selectedOrderId || 0
  );

  const acceptOrder = useAcceptShopperOrder();
  const completeOrder = useCompleteShopperOrder();

  const handleAcceptOrder = async (orderId: number) => {
    try {
      await acceptOrder.mutateAsync(orderId);
      toast.success('Order accepted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept order');
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    try {
      await completeOrder.mutateAsync(orderId);
      toast.success('Order marked as complete!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete order');
    }
  };

  const getStatusBadge = (status: any) => {
    if (status.__kind__ === 'pending') {
      return <Badge variant="outline">Available</Badge>;
    }
    if (status.__kind__ === 'assigned') {
      return <Badge>Shopping</Badge>;
    }
    return <Badge variant="secondary">{status.__kind__}</Badge>;
  };

  return (
    <div className="container-custom py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Shopper Dashboard</h1>
        <p className="text-muted-foreground">
          Accept orders and shop for customers in your town
        </p>
      </div>

      {/* Available Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <CardTitle>Available Orders</CardTitle>
          </div>
          <CardDescription>
            Orders from pickup points in your town waiting to be accepted
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eligibleLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !eligibleOrders || eligibleOrders.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No available orders at the moment. Check back soon!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eligibleOrders.map((order) => (
                    <TableRow key={Number(order.id)}>
                      <TableCell className="font-medium">#{Number(order.id)}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>{formatZAR(order.totalAmount)}</TableCell>
                      <TableCell>{formatICDateTime(order.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrderId(Number(order.id))}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAcceptOrder(Number(order.id))}
                          disabled={acceptOrder.isPending}
                        >
                          {acceptOrder.isPending ? 'Accepting...' : 'Accept'}
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

      {/* My Active Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>My Active Orders</CardTitle>
          </div>
          <CardDescription>Orders you are currently shopping for</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : !assignedOrders || assignedOrders.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't have any active orders. Accept an order from the available list above.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedOrders.map((order) => (
                    <TableRow key={Number(order.id)}>
                      <TableCell className="font-medium">#{Number(order.id)}</TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>{formatZAR(order.totalAmount)}</TableCell>
                      <TableCell>{formatICDateTime(order.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrderId(Number(order.id))}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleCompleteOrder(Number(order.id))}
                          disabled={completeOrder.isPending}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {completeOrder.isPending ? 'Completing...' : 'Complete'}
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

      {/* Order Details Dialog */}
      <Dialog open={selectedOrderId !== null} onOpenChange={() => setSelectedOrderId(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrderId}</DialogTitle>
            <DialogDescription>
              Complete shopping list with product and retailer information
            </DialogDescription>
          </DialogHeader>

          {detailsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold">{formatZAR(orderDetails.order.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(orderDetails.order.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm">{formatICDateTime(orderDetails.order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items</p>
                  <p className="text-sm">{orderDetails.order.items.length} items</p>
                </div>
              </div>

              {/* Shopping List */}
              <div>
                <h3 className="font-semibold mb-3">Shopping List</h3>
                <div className="space-y-3">
                  {orderDetails.expandedItems.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 flex-1">
                            <p className="font-medium">
                              {item.product?.name || 'Product unavailable'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.product?.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-muted-foreground">
                                Retailer:{' '}
                                <span className="font-medium text-foreground">
                                  {item.retailer?.name || 'Unknown'}
                                </span>
                              </span>
                              {item.retailer && (
                                <span className="text-muted-foreground">
                                  {item.retailer.townSuburb}
                                </span>
                              )}
                            </div>
                            {item.listing && (
                              <p className="text-sm text-muted-foreground">
                                Price: {formatZAR(item.listing.price)} each
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-sm text-muted-foreground">Quantity</p>
                            <p className="text-2xl font-bold">{Number(item.cartItem.quantity)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load order details</AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
