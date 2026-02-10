import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useActor } from '@/hooks/useActor';

export function AuthInitializationOverlay() {
  const { isLoggingIn, identity } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();

  const isAuthenticated = !!identity;
  const showLoading = isLoggingIn || (isAuthenticated && actorFetching);

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
