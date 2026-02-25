import React, { useEffect, useRef, useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useActor } from '@/hooks/useActor';
import { Loader2 } from 'lucide-react';

export function AuthInitializationOverlay() {
  const { identity, isInitializing, loginStatus } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  const [show, setShow] = useState(false);
  const initializedPrincipal = useRef<string | null>(null);

  const currentPrincipal = identity?.getPrincipal().toString() ?? null;
  const isLoggingIn = loginStatus === 'logging-in';

  useEffect(() => {
    if (isLoggingIn || isInitializing) {
      setShow(true);
      return;
    }

    if (currentPrincipal && currentPrincipal !== initializedPrincipal.current) {
      if (actorFetching) {
        setShow(true);
      } else {
        initializedPrincipal.current = currentPrincipal;
        setShow(false);
      }
    } else if (!currentPrincipal) {
      setShow(false);
    } else {
      setShow(false);
    }
  }, [isLoggingIn, isInitializing, currentPrincipal, actorFetching]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">
          {isLoggingIn ? 'Logging in...' : 'Initializing...'}
        </p>
      </div>
    </div>
  );
}

export default AuthInitializationOverlay;
