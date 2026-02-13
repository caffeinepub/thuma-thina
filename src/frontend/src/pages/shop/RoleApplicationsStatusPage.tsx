import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigate } from '@/router/HashRouter';
import { useGetMyShopperApplication } from '@/hooks/useShopperApplication';
import { useGetMyPickupPointApplication } from '@/hooks/usePickupPointApplication';
import { useGetMyDriverApplication } from '@/hooks/useDriverApplication';
import { formatICDateTime } from '@/utils/time';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';

export function RoleApplicationsStatusPage() {
  const { data: shopperApplication, isLoading: shopperLoading, isFetched: shopperFetched } = useGetMyShopperApplication();
  const { data: pickupPointApplication, isLoading: pickupLoading, isFetched: pickupFetched } = useGetMyPickupPointApplication();
  const { data: driverApplication, isLoading: driverLoading, isFetched: driverFetched } = useGetMyDriverApplication();

  const hasShopperApplication = shopperApplication !== null;
  const hasPickupPointApplication = pickupPointApplication !== null;
  const hasDriverApplication = driverApplication !== null;
  const hasAnyApplication = hasShopperApplication || hasPickupPointApplication || hasDriverApplication;

  const getStatusBadge = (status: any) => {
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

  const getStatusMessage = (status: any, rejectionReason?: string) => {
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
            Congratulations! Your application has been approved.
          </AlertDescription>
        </Alert>
      );
    }

    if (status.__kind__ === 'rejected') {
      return (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Your application was rejected. Reason: {status.rejected || rejectionReason || 'No reason provided'}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  if (shopperLoading || pickupLoading || driverLoading) {
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

        {!hasAnyApplication && shopperFetched && pickupFetched && driverFetched && (
          <>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                You haven't submitted any applications yet. Apply now to become a personal shopper, driver, or pickup point!
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

        {hasShopperApplication && shopperApplication && (
          <>
            {getStatusMessage(shopperApplication.status, shopperApplication.rejectionReason || undefined)}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Shopper Application</CardTitle>
                    <CardDescription>
                      Submitted on {formatICDateTime(shopperApplication.submittedAt)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(shopperApplication.status)}
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
                    <div className="border rounded-lg p-4 bg-muted/50 max-w-xs">
                      <img
                        src={getExternalBlobUrl(shopperApplication.selfieImage)}
                        alt="Shopper selfie"
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {hasPickupPointApplication && pickupPointApplication && (
          <>
            {getStatusMessage(pickupPointApplication.status)}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pickup Point Application</CardTitle>
                    <CardDescription>
                      Submitted on {formatICDateTime(pickupPointApplication.submittedAt)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(pickupPointApplication.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Business Name</p>
                    <p className="text-base">{pickupPointApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Number</p>
                    <p className="text-base">{pickupPointApplication.contactNumber}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-base">{pickupPointApplication.address}</p>
                  </div>
                </div>

                {pickupPointApplication.businessImage && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Business Image</p>
                    <div className="border rounded-lg p-4 bg-muted/50 max-w-md">
                      <img
                        src={getExternalBlobUrl(pickupPointApplication.businessImage)}
                        alt="Business"
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {hasDriverApplication && driverApplication && (
          <>
            {getStatusMessage(driverApplication.status)}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Driver Application</CardTitle>
                    <CardDescription>
                      Submitted on {formatICDateTime(driverApplication.submittedAt)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(driverApplication.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-base">{driverApplication.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-base">{driverApplication.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-base">{driverApplication.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Vehicle Details</p>
                    <p className="text-base">{driverApplication.vehicleDetails}</p>
                  </div>
                </div>

                {driverApplication.kycDocs && driverApplication.kycDocs.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Selfie Image</p>
                    <div className="border rounded-lg p-4 bg-muted/50 max-w-xs">
                      <img
                        src={getExternalBlobUrl(driverApplication.kycDocs[0])}
                        alt="Driver selfie"
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
