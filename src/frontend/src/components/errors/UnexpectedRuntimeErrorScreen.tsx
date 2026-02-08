import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface UnexpectedRuntimeErrorScreenProps {
  error?: Error;
  resetError?: () => void;
}

export function UnexpectedRuntimeErrorScreen({ error, resetError }: UnexpectedRuntimeErrorScreenProps) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full border-destructive/50 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Something Went Wrong
          </CardTitle>
          <CardDescription className="text-base">
            An unexpected error occurred during sign-in or while loading the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="mt-2 text-sm font-mono break-words">
                {error.message || 'Unknown error'}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-sm text-muted-foreground text-center">
            Please try reloading the page or returning to the home page. If the problem persists, try clearing your browser cache or logging out and back in.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleReload}
            className="flex-1 w-full"
            variant="default"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
          <Button
            onClick={handleGoHome}
            className="flex-1 w-full"
            variant="outline"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
