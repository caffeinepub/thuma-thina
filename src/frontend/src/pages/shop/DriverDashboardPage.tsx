import { useListEligibleDriverOrders } from '@/hooks/useDriverOrders';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatICDateTime } from '@/utils/time';
import { formatZAR } from '@/utils/money';
import { Truck, AlertCircle } from 'lucide-react';
import type { OrderRecord, OrderStatus } from '@/backend';

export function DriverDashboardPage() {
  const { data: eligibleOrders, isLoading, isError } = useListEligibleDriverOrders();

  const getStatusBadge = (status: OrderStatus | undefined) => {
    if (!status) {
      return <Badge variant="secondary">Unknown</Badge>;
    }

    // Handle the status variant shape safely
    const statusKind = (status as any).__kind__;
    
    if (statusKind === 'purchased') {
      return <Badge>Ready for Pickup</Badge>;
    }
    
    if (statusKind === 'pending') {
      return <Badge variant="secondary">Pending</Badge>;
    }
    
    if (statusKind === 'assigned') {
      return <Badge variant="secondary">Assigned</Badge>;
    }
    
    if (statusKind === 'ready') {
      return <Badge variant="secondary">Ready</Badge>;
    }
    
    if (statusKind === 'inDelivery') {
      return <Badge variant="secondary">In Delivery</Badge>;
    }
    
    if (statusKind === 'delivered') {
      return <Badge variant="secondary">Delivered</Badge>;
    }
    
    if (statusKind === 'cancelled') {
      return <Badge variant="destructive">Cancelled</Badge>;
    }

    // Fallback for unknown status
    return <Badge variant="secondary">{statusKind || 'Unknown'}</Badge>;
  };

  const safeFormatOrderId = (order: OrderRecord): string => {
    try {
      return `#${Number(order.id)}`;
    } catch {
      return '#N/A';
    }
  };

  const safeGetItemCount = (order: OrderRecord): string => {
    try {
      const count = order.items?.length ?? 0;
      return `${count} ${count === 1 ? 'item' : 'items'}`;
    } catch {
      return '0 items';
    }
  };

  const safeFormatTotal = (order: OrderRecord): string => {
    try {
      if (order.totalAmount === undefined || order.totalAmount === null) {
        return 'R 0.00';
      }
      return formatZAR(order.totalAmount);
    } catch {
      return 'R 0.00';
    }
  };

  const safeFormatCreatedAt = (order: OrderRecord): string => {
    try {
      if (!order.createdAt) {
        return 'N/A';
      }
      return formatICDateTime(order.createdAt);
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="container-custom py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Driver Dashboard</h1>
        <p className="text-muted-foreground">
          View orders ready for delivery in your town
        </p>
      </div>

      {/* Eligible Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <CardTitle>Available Orders</CardTitle>
          </div>
          <CardDescription>
            Orders completed by shoppers and ready for delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load orders. Please try again later.
              </AlertDescription>
            </Alert>
          ) : !eligibleOrders || eligibleOrders.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No orders available for delivery at the moment. Check back soon!
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eligibleOrders.map((order) => {
                    // Defensive key generation
                    const orderKey = order?.id ? String(order.id) : `order-${Math.random()}`;
                    
                    return (
                      <TableRow key={orderKey}>
                        <TableCell className="font-medium">
                          {safeFormatOrderId(order)}
                        </TableCell>
                        <TableCell>{safeGetItemCount(order)}</TableCell>
                        <TableCell>{safeFormatTotal(order)}</TableCell>
                        <TableCell>{safeFormatCreatedAt(order)}</TableCell>
                        <TableCell>{getStatusBadge(order?.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
