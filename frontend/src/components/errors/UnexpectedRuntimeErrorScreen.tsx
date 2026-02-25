import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UnexpectedRuntimeErrorScreenProps {
  error?: Error;
}

export function UnexpectedRuntimeErrorScreen({ error }: UnexpectedRuntimeErrorScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs font-mono break-all">
                {error.message}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
            <Button
              variant="outline"
              onClick={() => { window.location.hash = '#/'; window.location.reload(); }}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UnexpectedRuntimeErrorScreen;
