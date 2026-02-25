import React from 'react';
import { Map, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function MyTownsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Map className="h-6 w-6 text-primary" />
          My Towns
        </h1>
        <p className="text-muted-foreground mt-1">Manage your town associations</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Feature Unavailable</AlertTitle>
        <AlertDescription>
          Town management is not available in the current backend version.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Map className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Town management requires backend support</p>
        </CardContent>
      </Card>
    </div>
  );
}
