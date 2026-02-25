import React from 'react';
import { Truck, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DriverDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          Driver Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Manage your delivery assignments</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Feature Unavailable</AlertTitle>
        <AlertDescription>
          Driver order management is not available in the current backend version.
          Please check back later.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Eligible Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            <Truck className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No deliveries available at this time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
