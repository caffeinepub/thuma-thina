import React from 'react';
import { useMyDriverApplication } from '@/hooks/useDriverApplication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Truck } from 'lucide-react';

interface RequireApprovedDriverProps {
  children: React.ReactNode;
}

export function RequireApprovedDriver({ children }: RequireApprovedDriverProps) {
  const { data: application, isLoading } = useMyDriverApplication();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const isApproved = application?.status.__kind__ === 'approved';

  if (!isApproved) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Driver Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need to be an approved driver to access this area.
            </p>
            <a href="#/apply/driver" className="text-primary underline text-sm mt-2 block">
              Apply as a Driver
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireApprovedDriver;
