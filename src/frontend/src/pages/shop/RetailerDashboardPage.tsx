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
import { Store, Package, AlertCircle, ShoppingBag } from 'lucide-react';
import { useGetMyRetailer, useGetMyRetailerInventory } from '@/hooks/useRetailerPortal';
import { useListProducts } from '@/hooks/useProducts';
import { navigate } from '@/router/HashRouter';
import { formatZAR } from '@/utils/money';
import { ListingStatus } from '@/backend';

export function RetailerDashboardPage() {
  const { data: retailer, isLoading: retailerLoading, error: retailerError } = useGetMyRetailer();
  const { data: inventory, isLoading: inventoryLoading, error: inventoryError } = useGetMyRetailerInventory();
  const { data: products } = useListProducts();

  const getProductName = (productId: bigint) => {
    const product = products?.find((p) => p.id === productId);
    return product?.name || `Product #${productId}`;
  };

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.active:
        return <Badge variant="default">Active</Badge>;
      case ListingStatus.outOfStock:
        return <Badge variant="secondary">Out of Stock</Badge>;
      case ListingStatus.discontinued:
        return <Badge variant="destructive">Discontinued</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (retailerError || inventoryError) {
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
      </div>
    );
  }

  if (retailerLoading || inventoryLoading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12 text-muted-foreground">Loading retailer dashboard...</div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="container-custom py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Retailer Association</AlertTitle>
          <AlertDescription>
            Your account is not linked to any retailer. Please contact an administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalStock = inventory?.reduce((sum, item) => sum + Number(item.stock), 0) || 0;
  const activeListings = inventory?.filter((item) => item.status === ListingStatus.active).length || 0;

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Retailer Dashboard</h1>
          <p className="text-muted-foreground">Manage your inventory and track orders</p>
        </div>

        {/* Retailer Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>{retailer.name}</CardTitle>
            </div>
            <CardDescription>
              {retailer.townSuburb}, {retailer.province}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Address</p>
                <p>{retailer.address}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p>{retailer.phone}</p>
                <p>{retailer.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStock}</div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Your product listings and stock levels</CardDescription>
              </div>
              <Button onClick={() => navigate('/retailer/orders')}>View Orders</Button>
            </div>
          </CardHeader>
          <CardContent>
            {!inventory || inventory.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No inventory items yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Contact an administrator to add product listings for your store
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={Number(item.id)}>
                      <TableCell className="font-medium">{getProductName(item.productId)}</TableCell>
                      <TableCell>{formatZAR(item.price)}</TableCell>
                      <TableCell>{Number(item.stock)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
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
