import React from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { LoginButton } from '@/components/auth/LoginButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return null;
  }

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Login Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in to access this page.
            </p>
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default RequireAuth;
