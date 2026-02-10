import { ReactNode } from 'react';
import { useIsCallerApproved, useRequestApproval, useIsCallerAdmin } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Clock } from 'lucide-react';

interface RequireApprovedProps {
  children: ReactNode;
}

export function RequireApproved({ children }: RequireApprovedProps) {
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const requestApproval = useRequestApproval();

  if (approvalLoading || adminLoading) {
    return null;
  }

  // Admins bypass approval
  if (isAdmin) {
    return <>{children}</>;
  }

  if (!isApproved) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Approval Required</CardTitle>
            <CardDescription>
              Your account needs to be approved before you can access the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {requestApproval.isSuccess ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Your approval request has been submitted. An administrator will review it shortly.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    Request approval to start using Thuma Thina
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => requestApproval.mutate()}
                  disabled={requestApproval.isPending}
                  className="w-full"
                >
                  {requestApproval.isPending ? 'Requesting...' : 'Request Approval'}
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
