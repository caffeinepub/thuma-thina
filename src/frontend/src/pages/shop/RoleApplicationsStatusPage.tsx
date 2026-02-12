import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigate } from '@/router/HashRouter';
import { useGetMyShopperApplication } from '@/hooks/useShopperApplication';
import { formatICDateTime } from '@/utils/time';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';

export function RoleApplicationsStatusPage() {
  const { data: shopperApplication, isLoading, isFetched } = useGetMyShopperApplication();

  const hasApplication = shopperApplication !== null;

  const getStatusBadge = () => {
    if (!shopperApplication) return null;

    const status = shopperApplication.status;

    if (status.__kind__ === 'pending') {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending Review
        </Badge>
      );
    }

    if (status.__kind__ === 'approved') {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          Approved
        </Badge>
      );
    }

    if (status.__kind__ === 'rejected') {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
    }

    return null;
  };

  const getStatusMessage = () => {
    if (!shopperApplication) return null;

    const status = shopperApplication.status;

    if (status.__kind__ === 'pending') {
      return (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Your application is currently under review. We'll notify you once a decision has been made.
          </AlertDescription>
        </Alert>
      );
    }

    if (status.__kind__ === 'approved') {
      return (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Congratulations! Your application has been approved. You can now start accepting shopping assignments.
          </AlertDescription>
        </Alert>
      );
    }

    if (status.__kind__ === 'rejected') {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Your application was rejected. Reason: {status.rejected}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track the status of your role applications
          </p>
        </div>

        {!hasApplication && isFetched && (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You haven't submitted any applications yet. Apply now to become a personal shopper!
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>No Applications Yet</CardTitle>
                <CardDescription>
                  Start your journey by applying for a role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/join-us')}>
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {hasApplication && shopperApplication && (
          <>
            {getStatusMessage()}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Shopper Application</CardTitle>
                    <CardDescription>
                      Submitted on {formatICDateTime(shopperApplication.submittedAt)}
                    </CardDescription>
                  </div>
                  {getStatusBadge()}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-base">{shopperApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base">{shopperApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-base">{shopperApplication.phone}</p>
                  </div>
                  {shopperApplication.reviewedAt && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reviewed On</p>
                      <p className="text-base">{formatICDateTime(shopperApplication.reviewedAt)}</p>
                    </div>
                  )}
                </div>

                {shopperApplication.selfieImage && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Selfie Image</p>
                    <img
                      src={getExternalBlobUrl(shopperApplication.selfieImage)}
                      alt="Applicant selfie"
                      className="max-w-xs rounded-lg border"
                    />
                  </div>
                )}

                {shopperApplication.status.__kind__ === 'rejected' && (
                  <div className="pt-4 border-t">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        If you believe this was a mistake or would like to reapply with updated information, please contact support.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Other Roles</CardTitle>
            <CardDescription>
              Interested in other opportunities?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Driver and Pickup Point applications are coming soon. Check back later!
            </p>
            <Button variant="outline" onClick={() => navigate('/join-us')}>
              View All Roles
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
