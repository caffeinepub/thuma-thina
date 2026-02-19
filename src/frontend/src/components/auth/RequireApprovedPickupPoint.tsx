import { ReactNode } from 'react';
import { useGetMyPickupPointStatus } from '@/hooks/usePickupPointApplication';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock } from 'lucide-react';
import { navigate } from '@/router/HashRouter';

interface RequireApprovedPickupPointProps {
  children: ReactNode;
}

export function RequireApprovedPickupPoint({ children }: RequireApprovedPickupPointProps) {
  const { data: pickupPointStatus, isLoading: statusLoading } = useGetMyPickupPointStatus();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (statusLoading || adminLoading) {
    return null;
  }

  // Admins bypass pickup point approval
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check if pickup point is approved
  const isApproved = pickupPointStatus?.__kind__ === 'approved';

  if (!isApproved) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Pickup Point Access Required</CardTitle>
            <CardDescription>
              You need to be an approved pickup point to access this area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!pickupPointStatus && (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You haven't applied to become a pickup point yet
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => navigate('/join-us/pickup-point-application')}
                  className="w-full"
                >
                  Apply Now
                </Button>
              </>
            )}
            {pickupPointStatus?.__kind__ === 'pending' && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Your application is pending review. An administrator will review it shortly.
                </AlertDescription>
              </Alert>
            )}
            {pickupPointStatus?.__kind__ === 'rejected' && (
              <>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your application was rejected: {pickupPointStatus.rejected}
                  </AlertDescription>
                </Alert>
                <Button
                  variant="outline"
                  onClick={() => navigate('/my-applications')}
                  className="w-full"
                >
                  View Application Status
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
