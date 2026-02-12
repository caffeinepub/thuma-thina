import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';
import { useListAllOrders, useUpdateOrderStatus } from '@/hooks/useAdminOrders';
import { OrderStatus, PaymentMethod } from '@/backend';
import { formatICTime } from '@/utils/time';
import { formatZAR } from '@/utils/money';
import { Principal } from '@icp-sdk/core/principal';

export function AdminOrdersPage() {
  const { data: orders, isLoading } = useListAllOrders();
  const updateStatus = useUpdateOrderStatus();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newStatus, setNewStatus] = useState<string>('');
  const [assignmentInput, setAssignmentInput] = useState('');

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status.__kind__) {
      case 'pending':
        return 'secondary';
      case 'assigned':
      case 'purchased':
      case 'ready':
        return 'default';
      case 'inDelivery':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    switch (status.__kind__) {
      case 'pending':
        return 'Pending';
      case 'assigned':
        return `Assigned (Shopper: ${status.assigned.shopperId.toString().slice(0, 8)}...)`;
      case 'purchased':
        return 'Purchased';
      case 'ready':
        return 'Ready for Delivery';
      case 'inDelivery':
        return `In Delivery (Driver: ${status.inDelivery.driverId.toString().slice(0, 8)}...)`;
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return `Cancelled: ${status.cancelled}`;
      default:
        return 'Unknown';
    }
  };

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders?.filter((order) => order.status.__kind__ === statusFilter);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setNewStatus('');
    setAssignmentInput('');
    setShowDetailsDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      let statusPayload: OrderStatus;

      switch (newStatus) {
        case 'pending':
          statusPayload = { __kind__: 'pending', pending: null };
          break;
        case 'assigned':
          if (!assignmentInput.trim()) {
            toast.error('Please enter a shopper principal ID');
            return;
          }
          try {
            const shopperId = Principal.fromText(assignmentInput.trim());
            statusPayload = { __kind__: 'assigned', assigned: { shopperId } };
          } catch {
            toast.error('Invalid principal ID format');
            return;
          }
          break;
        case 'purchased':
          statusPayload = { __kind__: 'purchased', purchased: null };
          break;
        case 'ready':
          statusPayload = { __kind__: 'ready', ready: null };
          break;
        case 'inDelivery':
          if (!assignmentInput.trim()) {
            toast.error('Please enter a driver principal ID');
            return;
          }
          try {
            const driverId = Principal.fromText(assignmentInput.trim());
            statusPayload = { __kind__: 'inDelivery', inDelivery: { driverId } };
          } catch {
            toast.error('Invalid principal ID format');
            return;
          }
          break;
        case 'delivered':
          statusPayload = { __kind__: 'delivered', delivered: null };
          break;
        case 'cancelled':
          if (!assignmentInput.trim()) {
            toast.error('Please enter a cancellation reason');
            return;
          }
          statusPayload = { __kind__: 'cancelled', cancelled: assignmentInput.trim() };
          break;
        default:
          toast.error('Invalid status');
          return;
      }

      await updateStatus.mutateAsync({
        orderId: selectedOrder.id,
        status: statusPayload,
      });

      toast.success('Order status updated successfully');
      setShowDetailsDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Order Management
          </h1>
          <p className="text-muted-foreground">View and manage all orders on the platform</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>Filter and manage order statuses</CardDescription>
              </div>
              <div className="w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="purchased">Purchased</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="inDelivery">In Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : !filteredOrders || filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No orders found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id.toString()}>
                      <TableCell className="font-mono text-xs">#{order.id.toString()}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {order.customer.toString().slice(0, 12)}...
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {order.items.length}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatZAR(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatICTime(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(order)}>
                          View / Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Details & Status Update Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details & Status Update</DialogTitle>
            <DialogDescription>View order information and update status</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order ID</Label>
                  <p className="text-sm font-mono mt-1">#{selectedOrder.id.toString()}</p>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="text-sm font-mono mt-1">{selectedOrder.customer.toString()}</p>
                </div>
                <div>
                  <Label>Total Amount</Label>
                  <p className="text-sm font-medium mt-1">{formatZAR(selectedOrder.totalAmount)}</p>
                </div>
                <div>
                  <Label>Payment Method</Label>
                  <p className="text-sm mt-1 capitalize">
                    {selectedOrder.paymentMethod === PaymentMethod.zar
                      ? 'ZAR'
                      : selectedOrder.paymentMethod === PaymentMethod.icp
                      ? 'ICP'
                      : 'NomaYini'}
                  </p>
                </div>
                <div>
                  <Label>Created</Label>
                  <p className="text-sm mt-1">{formatICTime(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <Label>Current Status</Label>
                  <Badge className="mt-1" variant={getStatusBadgeVariant(selectedOrder.status)}>
                    {getStatusLabel(selectedOrder.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Items ({selectedOrder.items.length})</Label>
                <div className="mt-2 space-y-1">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="text-sm flex justify-between">
                      <span>
                        Listing #{item.listingId.toString()} × {item.quantity.toString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-base font-semibold">Update Order Status</Label>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="new-status">New Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger id="new-status" className="mt-2">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned (requires shopper ID)</SelectItem>
                        <SelectItem value="purchased">Purchased</SelectItem>
                        <SelectItem value="ready">Ready for Delivery</SelectItem>
                        <SelectItem value="inDelivery">In Delivery (requires driver ID)</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled (requires reason)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(newStatus === 'assigned' || newStatus === 'inDelivery' || newStatus === 'cancelled') && (
                    <div>
                      <Label htmlFor="assignment-input">
                        {newStatus === 'assigned'
                          ? 'Shopper Principal ID'
                          : newStatus === 'inDelivery'
                          ? 'Driver Principal ID'
                          : 'Cancellation Reason'}
                      </Label>
                      <Input
                        id="assignment-input"
                        placeholder={
                          newStatus === 'cancelled'
                            ? 'Enter reason...'
                            : 'Enter principal ID...'
                        }
                        value={assignmentInput}
                        onChange={(e) => setAssignmentInput(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={!newStatus || updateStatus.isPending}>
              {updateStatus.isPending ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
