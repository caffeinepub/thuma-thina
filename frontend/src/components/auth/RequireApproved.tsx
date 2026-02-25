import React from 'react';
import { useIsCallerApproved, useRequestApproval } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck } from 'lucide-react';

interface RequireApprovedProps {
  children: React.ReactNode;
}

export function RequireApproved({ children }: RequireApprovedProps) {
  const { identity } = useInternetIdentity();
  const { data: isApproved, isLoading } = useIsCallerApproved();
  const requestApproval = useRequestApproval();

  if (!identity) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your account needs to be approved before you can access this feature.
            </p>
            <Button
              onClick={() => requestApproval.mutate()}
              disabled={requestApproval.isPending}
            >
              {requestApproval.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Request Approval
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireApproved;
