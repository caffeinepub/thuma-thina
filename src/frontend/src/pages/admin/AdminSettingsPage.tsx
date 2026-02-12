import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, AlertTriangle } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { DangerZoneWipeSystemCard } from '@/components/admin/DangerZoneWipeSystemCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function AdminSettingsPage() {
  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            System Settings
          </h1>
          <p className="text-muted-foreground">Configure system-wide settings and perform administrative actions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>System configuration options</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Coming Soon</AlertTitle>
              <AlertDescription>
                Additional system settings will be available here, including default town configuration, pricing settings, and more.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-xl font-bold">Danger Zone</h2>
          </div>
          <DangerZoneWipeSystemCard />
        </div>
      </div>
    </div>
  );
}
