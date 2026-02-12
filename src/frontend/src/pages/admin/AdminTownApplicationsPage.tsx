import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { navigate } from '@/router/HashRouter';

export function AdminTownApplicationsPage() {
  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Town Applications</h1>
            <p className="text-muted-foreground">Review additional town membership applications</p>
          </div>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Town membership applications are no longer required. Users can now freely add and remove favorite
            towns without admin approval.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>No Applications Required</CardTitle>
            <CardDescription>
              The favorite towns system allows users to manage their own town preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Users can now add or remove favorite towns at any time without needing admin approval. This page
              is no longer needed for the current workflow.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
