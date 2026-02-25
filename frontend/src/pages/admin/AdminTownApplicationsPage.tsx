import React from 'react';
import { Map, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function AdminTownApplicationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <a
          href="#/admin"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin
        </a>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Map className="h-6 w-6 text-primary" />
          Town Applications
        </h1>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          Town membership applications are no longer required. Users can freely manage their town associations.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Map className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No town applications to review</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminTownApplicationsPage;
