import React from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          Checkout
        </h1>
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Checkout Unavailable</AlertTitle>
        <AlertDescription>
          Order placement is not available in the current backend version.
          Please check back later.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>Checkout functionality requires backend support.</p>
          <button
            className="mt-4 text-primary underline"
            onClick={() => (window.location.hash = '#/cart')}
          >
            Return to Cart
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
