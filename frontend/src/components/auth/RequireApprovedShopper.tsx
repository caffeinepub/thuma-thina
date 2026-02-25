import React from 'react';
import { useMyShopperApplication } from '@/hooks/useShopperApplication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShoppingBag } from 'lucide-react';

interface RequireApprovedShopperProps {
  children: React.ReactNode;
}

export function RequireApprovedShopper({ children }: RequireApprovedShopperProps) {
  const { data: application, isLoading } = useMyShopperApplication();

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
              <ShoppingBag className="h-5 w-5 text-primary" />
              Shopper Approval Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You need to be an approved personal shopper to access this area.
            </p>
            <a href="#/apply/shopper" className="text-primary underline text-sm mt-2 block">
              Apply as a Personal Shopper
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireApprovedShopper;
