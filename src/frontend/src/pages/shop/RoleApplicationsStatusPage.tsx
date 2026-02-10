import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigate } from '@/router/HashRouter';

export function RoleApplicationsStatusPage() {
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your role applications
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            The application tracking system is being implemented. Once available, you'll be able to see the status of your driver, shopper, and pickup point applications here.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>No Applications Yet</CardTitle>
            <CardDescription>
              You haven't submitted any applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/join-us')}>
              Apply Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
