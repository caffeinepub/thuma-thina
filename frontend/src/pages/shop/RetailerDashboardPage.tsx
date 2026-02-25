import React from 'react';
import { Store, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function RetailerDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          Retailer Dashboard
        </h1>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Feature Unavailable</AlertTitle>
        <AlertDescription>
          Retailer dashboard is not available in the current backend version.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Store className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Retailer portal requires backend support</p>
        </CardContent>
      </Card>
    </div>
  );
}
