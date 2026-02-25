import React, { useState } from 'react';
import { ShoppingBag, Package, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePendingOrders, useListEligibleOrders, useListAssignedOrders } from '@/hooks/useShopperOrders';
import { OrderRecord } from '@/backend';
import { formatICDateTime } from '@/utils/time';
import { formatZAR } from '@/utils/money';

function getStatusBadge(status: OrderRecord['status']) {
  const kind = status.__kind__;
  switch (kind) {
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'assigned':
      return <Badge variant="default">Assigned</Badge>;
    case 'purchased':
      return <Badge variant="outline">Purchased</Badge>;
    case 'ready':
      return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
    case 'inDelivery':
      return <Badge variant="default">In Delivery</Badge>;
    case 'delivered':
      return <Badge className="bg-green-600 text-white">Delivered</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{kind}</Badge>;
  }
}

export default function ShopperDashboardPage() {
  const { data: pendingOrders = [], isLoading: pendingLoading } = usePendingOrders();
  const { data: eligibleOrders = [], isLoading: eligibleLoading } = useListEligibleOrders();
  const { data: assignedOrders = [], isLoading: assignedLoading } = useListAssignedOrders();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          Shopper Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Manage your shopping assignments</p>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-6">
          <TabsTrigger value="orders">
            Orders
            {pendingOrders.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {pendingOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="available">Available Orders</TabsTrigger>
          <TabsTrigger value="active">My Active Orders</TabsTrigger>
        </TabsList>

        {/* Orders Tab - Pending Orders */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : pendingOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No pending orders at this time</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingOrders.map((order) => (
                      <TableRow key={order.id.toString()}>
                        <TableCell className="font-mono text-sm">
                          #{order.id.toString()}
                        </TableCell>
                        <TableCell>{order.items?.length ?? 0} item(s)</TableCell>
                        <TableCell>{formatZAR(order.totalAmount)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatICDateTime(order.createdAt)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Orders Tab */}
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {eligibleLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Feature Unavailable</AlertTitle>
                  <AlertDescription>
                    Order acceptance is not available in the current backend version.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Orders Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Active Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {assignedLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Feature Unavailable</AlertTitle>
                  <AlertDescription>
                    Active order management is not available in the current backend version.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
