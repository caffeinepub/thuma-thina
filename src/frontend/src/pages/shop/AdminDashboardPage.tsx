import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  ShoppingBag,
  Store,
  Package,
  Truck,
  MapPin,
  Settings,
  Map,
  FileText,
} from 'lucide-react';
import { navigate } from '@/router/HashRouter';

export function AdminDashboardPage() {
  return (
    <div className="container-custom py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Thuma Thina platform</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/shoppers')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <Badge variant="secondary">Active</Badge>
              </div>
              <CardTitle>Personal Shoppers</CardTitle>
              <CardDescription>Manage shopper applications and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Shoppers
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/drivers')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Truck className="h-8 w-8 text-primary" />
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
              <CardTitle>Delivery Drivers</CardTitle>
              <CardDescription>Manage driver applications and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Drivers
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/pickup-points')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <MapPin className="h-8 w-8 text-primary" />
                <Badge variant="secondary">Active</Badge>
              </div>
              <CardTitle>Pickup Points</CardTitle>
              <CardDescription>Manage pickup point applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Pickup Points
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/retailers')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Retailers</CardTitle>
              <CardDescription>Manage retailers and their information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Retailers
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/products')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Products
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/listings')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Listings</CardTitle>
              <CardDescription>Manage product listings and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Listings
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/orders')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Orders
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/towns')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Map className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Towns</CardTitle>
              <CardDescription>Manage towns and locations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Manage Towns
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/settings')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Settings className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
