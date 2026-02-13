import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';

export function PickupPointDashboardPage() {
  return (
    <div className="container-custom py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pickup Point Dashboard</h1>
        <p className="text-muted-foreground">
          Manage orders and shop on behalf of walk-in customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle>Welcome to Your Dashboard</CardTitle>
          </div>
          <CardDescription>
            This dashboard is being built to help you create and manage orders for your customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Coming soon: Browse listings, create orders, and track order status for your pickup point.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
