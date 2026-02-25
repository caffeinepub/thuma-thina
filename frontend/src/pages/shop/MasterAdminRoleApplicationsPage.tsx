import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MasterAdminRoleApplicationsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <a
          href="#/join-us"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </a>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Role Applications Review
        </h1>
      </div>

      <Alert className="mb-6">
        <AlertDescription>
          Role application management is not available in the current backend version.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Shield className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Application review requires backend support</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default MasterAdminRoleApplicationsPage;
