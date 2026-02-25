import React from 'react';
import { ClipboardList, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

export default function RoleApplicationsStatusPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          My Applications
        </h1>
        <p className="text-muted-foreground mt-1">Track your role application status</p>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Feature Unavailable</AlertTitle>
        <AlertDescription>
          Application status tracking is not available in the current backend version.
          Please check back later.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Application tracking requires backend support</p>
        </CardContent>
      </Card>
    </div>
  );
}
