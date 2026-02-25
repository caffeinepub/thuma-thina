import React from 'react';
import RequireAdmin from '@/components/auth/RequireAdmin';
import { Settings, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <RequireAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">Configure system settings</p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Settings</AlertTitle>
          <AlertDescription>
            System settings are managed through the backend configuration.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No configurable settings available at this time.</p>
          </CardContent>
        </Card>
      </div>
    </RequireAdmin>
  );
}
