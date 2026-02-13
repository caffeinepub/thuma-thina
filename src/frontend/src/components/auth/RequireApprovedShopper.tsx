import { ReactNode } from 'react';
import { useGetMyShopperStatus } from '@/hooks/useShopperApplication';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Clock } from 'lucide-react';
import { navigate } from '@/router/HashRouter';

interface RequireApprovedShopperProps {
  children: ReactNode;
}

export function RequireApprovedShopper({ children }: RequireApprovedShopperProps) {
  const { data: shopperStatus, isLoading: statusLoading } = useGetMyShopperStatus();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  if (statusLoading || adminLoading) {
    return null;
  }

  // Admins bypass shopper approval
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check if shopper is approved
  const isApproved = shopperStatus?.__kind__ === 'approved';

  if (!isApproved) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Personal Shopper Access Required</CardTitle>
            <CardDescription>
              You need to be an approved personal shopper to access this dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!shopperStatus && (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You haven't applied to become a personal shopper yet
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => navigate('/join-us/shopper-application')}
                  className="w-full"
                >
                  Apply Now
                </Button>
              </>
            )}
            {shopperStatus?.__kind__ === 'pending' && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Your application is pending review. An administrator will review it shortly.
                </AlertDescription>
              </Alert>
            )}
            {shopperStatus?.__kind__ === 'rejected' && (
              <>
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your application was rejected: {shopperStatus.rejected}
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
