import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { useGetMyDriverStatus } from '@/hooks/useDriverApplication';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { navigate } from '@/router/HashRouter';
import { AlertCircle, Truck, Clock, XCircle } from 'lucide-react';

interface RequireApprovedDriverProps {
  children: React.ReactNode;
}

export function RequireApprovedDriver({ children }: RequireApprovedDriverProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: driverStatus, isLoading: statusLoading } = useGetMyDriverStatus();

  const isLoading = adminLoading || statusLoading;

  // Show loading state
  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admins always have access
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check driver status
  if (!driverStatus) {
    // No application submitted
    return (
      <div className="container-custom py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <CardTitle>Driver Access Required</CardTitle>
            </div>
            <CardDescription>
              You need to be an approved driver to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You haven't submitted a driver application yet. Apply now to start delivering orders!
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/join-us/driver-application')}>
                Apply as Driver
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check application status
  if (driverStatus.__kind__ === 'pending') {
    return (
      <div className="container-custom py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-yellow-600" />
              <CardTitle>Application Pending</CardTitle>
            </div>
            <CardDescription>Your driver application is under review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Your driver application is currently being reviewed by our team. You'll be notified once it's approved.
              </AlertDescription>
            </Alert>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                Pending Review
              </Badge>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (driverStatus.__kind__ === 'rejected') {
    return (
      <div className="container-custom py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              <CardTitle>Application Rejected</CardTitle>
            </div>
            <CardDescription>Your driver application was not approved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Unfortunately, your driver application was rejected.
                {driverStatus.rejected && (
                  <span className="block mt-2 font-medium">
                    Reason: {driverStatus.rejected}
                  </span>
                )}
              </AlertDescription>
            </Alert>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Approved - show the protected content
  return <>{children}</>;
}
