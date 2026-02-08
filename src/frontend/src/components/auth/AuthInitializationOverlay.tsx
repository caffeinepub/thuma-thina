import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useActor } from '../../hooks/useActor';
import { Loader2 } from 'lucide-react';

export function AuthInitializationOverlay() {
  const { isLoggingIn, isInitializing, loginStatus } = useInternetIdentity();
  const { isFetching: actorFetching } = useActor();

  // Show overlay during login process or actor initialization after successful login
  const showOverlay = isLoggingIn || (loginStatus === 'success' && actorFetching);

  if (!showOverlay) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-card border border-border shadow-lg">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            {isLoggingIn ? 'Signing In...' : 'Loading...'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {isLoggingIn 
              ? 'Please complete the authentication process in the popup window.'
              : 'Initializing your session, please wait.'}
          </p>
        </div>
      </div>
    </div>
  );
}
