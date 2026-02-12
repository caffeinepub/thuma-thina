import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useActor } from '@/hooks/useActor';
import { useRef, useEffect } from 'react';

export function AuthInitializationOverlay() {
  const { isLoggingIn, identity } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();
  
  // Track if actor has been initialized for this session/principal
  const initializedPrincipalRef = useRef<string | null>(null);
  const currentPrincipal = identity?.getPrincipal().toString() || null;

  useEffect(() => {
    // Reset initialization flag when identity changes or becomes null
    if (currentPrincipal !== initializedPrincipalRef.current) {
      initializedPrincipalRef.current = null;
    }
  }, [currentPrincipal]);

  useEffect(() => {
    // Mark as initialized once actor is ready for this principal
    if (!actorFetching && currentPrincipal && !initializedPrincipalRef.current) {
      initializedPrincipalRef.current = currentPrincipal;
    }
  }, [actorFetching, currentPrincipal]);

  const isAuthenticated = !!identity;
  const hasInitialized = initializedPrincipalRef.current === currentPrincipal;
  
  // Show overlay only during login or first-time initialization for this session
  const showLoading = isLoggingIn || (isAuthenticated && actorFetching && !hasInitialized);

  if (showLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            {isLoggingIn ? 'Logging in...' : 'Initializing...'}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
