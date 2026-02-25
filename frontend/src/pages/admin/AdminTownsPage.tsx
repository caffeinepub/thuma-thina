import React, { useState } from 'react';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { Map, AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminTownsPage() {
  return (
    <RequireAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <Map className="h-6 w-6 text-primary" />
              Towns Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage towns and suburbs</p>
          </div>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Update Required</AlertTitle>
          <AlertDescription>
            Town management features are not available in the current backend version.
            The backend needs to be updated to support town CRUD operations.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Map className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No towns available</p>
              <p className="text-sm mt-1">Town management requires backend support</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAdmin>
  );
}
