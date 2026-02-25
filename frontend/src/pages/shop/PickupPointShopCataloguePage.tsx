import React from 'react';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export function PickupPointShopCataloguePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          Pickup Point Shop
        </h1>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Catalogue Unavailable</AlertTitle>
        <AlertDescription>
          The pickup point catalogue is not available in the current backend version.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No products available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PickupPointShopCataloguePage;
