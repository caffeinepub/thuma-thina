import React from 'react';
import { Package, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

interface OrderDetailPageProps {
  orderId: string;
}

export default function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Order #{orderId}
        </h1>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Order Details Unavailable</AlertTitle>
        <AlertDescription>
          Order details are not available in the current backend version.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <button
            className="text-primary underline"
            onClick={() => (window.location.hash = '#/my-orders')}
          >
            Return to My Orders
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
