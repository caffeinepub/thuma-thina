import React, { useState } from 'react';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminOrdersPage() {
  return (
    <RequireAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Orders Management
          </h1>
          <p className="text-muted-foreground mt-1">View and manage all customer orders</p>
        </div>

        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Backend Update Required</AlertTitle>
          <AlertDescription>
            Order management features are not available in the current backend version.
            The backend needs to be updated to support full order management operations.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No orders available</p>
              <p className="text-sm mt-1">Order management requires backend support</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RequireAdmin>
  );
}
