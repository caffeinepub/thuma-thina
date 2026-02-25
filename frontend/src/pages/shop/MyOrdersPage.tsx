import React from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function MyOrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          My Orders
        </h1>
        <p className="text-muted-foreground mt-1">View your order history</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Orders Unavailable</AlertTitle>
        <AlertDescription>
          Order history is not available in the current backend version.
          Please check back later.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No orders found</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
