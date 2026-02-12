import { useEffect, useState } from 'react';
import { useGetDefaultTown } from './useTownMembership';
import { useInternetIdentity } from './useInternetIdentity';

/**
 * Hook that automatically assigns "Osizweni" as default town for authenticated users.
 * Returns flags to control UI behavior during the assignment process.
 * 
 * Note: Currently disabled as town management backend methods are not yet implemented.
 */
export function useEnsureDefaultTownOsizweni() {
  const { identity } = useInternetIdentity();
  const { data: defaultTownId, isLoading, isFetched } = useGetDefaultTown();
  const [isAssigning, setIsAssigning] = useState(false);

  const isAuthenticated = !!identity;
  const hasDefaultTown = defaultTownId !== null;

  useEffect(() => {
    // Skip if not authenticated or still loading
    if (!isAuthenticated || isLoading || !isFetched) {
      return;
    }

    // Skip if user already has a default town
    if (hasDefaultTown) {
      return;
    }

    // Backend methods not yet implemented - skip auto-assignment
    // When backend is ready, this will automatically assign Osizweni
    console.log('Town management backend not yet implemented - skipping auto-assignment');
  }, [isAuthenticated, isLoading, isFetched, hasDefaultTown]);

  return {
    isAssigning,
    hasDefaultTown,
    shouldShowManualDialog: false, // Disabled until backend is ready
  };
}
