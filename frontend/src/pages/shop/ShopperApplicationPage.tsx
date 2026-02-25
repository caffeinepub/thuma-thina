import React from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function ShopperApplicationPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Apply as Personal Shopper
        </h1>
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Application Unavailable</AlertTitle>
        <AlertDescription>
          Personal shopper applications are not available in the current backend version.
          Please check back later.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <button
            className="text-primary underline"
            onClick={() => (window.location.hash = '#/join-us')}
          >
            Return to Join Us
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
