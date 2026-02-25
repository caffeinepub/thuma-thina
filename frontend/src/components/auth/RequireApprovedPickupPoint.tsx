import React from 'react';
import { useMyPickupPointApplication } from '@/hooks/usePickupPointApplication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';

interface RequireApprovedPickupPointProps {
  children: React.ReactNode;
}

export function RequireApprovedPickupPoint({ children }: RequireApprovedPickupPointProps) {
  const { data: application, isLoading } = useMyPickupPointApplication();

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
              <MapPin className="h-5 w-5 text-primary" />
              Pickup Point Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need to be an approved pickup point to access this area.
            </p>
            <a href="#/apply/pickup-point" className="text-primary underline text-sm mt-2 block">
              Apply as a Pickup Point
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireApprovedPickupPoint;
