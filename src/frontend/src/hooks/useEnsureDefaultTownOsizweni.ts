import { useEffect } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useGetDefaultTown, useSetDefaultTown } from './useTownMembership';
import { useActiveTowns } from './useTowns';

/**
 * Automatically assigns "Osizweni" as the default town for authenticated users
 * without a default town. Falls back to manual selection if Osizweni is unavailable
 * or assignment fails.
 */
export function useEnsureDefaultTownOsizweni() {
  const { identity } = useInternetIdentity();
  const { data: defaultTown, isLoading: defaultTownLoading, isFetched } = useGetDefaultTown();
  const { data: activeTowns, isLoading: activeTownsLoading } = useActiveTowns();
  const setDefaultTown = useSetDefaultTown();

  useEffect(() => {
    // Only proceed if user is authenticated and we have loaded the default town status
    if (!identity || defaultTownLoading || activeTownsLoading) {
      return;
    }

    // If user already has a default town, nothing to do
    if (defaultTown !== null) {
      return;
    }

    // If no active towns available, can't auto-assign
    if (!activeTowns || activeTowns.length === 0) {
      return;
    }

    // Try to find Osizweni town
    const osizweniTown = activeTowns.find(
      (town) => town.name.toLowerCase() === 'osizweni'
    );

    if (osizweniTown) {
      // Attempt to set Osizweni as default
      setDefaultTown.mutate(osizweniTown.id, {
        onError: (error) => {
          console.error('Failed to auto-assign Osizweni as default town:', error);
          // Error will be handled by DefaultTownSetupDialog
        },
      });
    }
    // If Osizweni not found, DefaultTownSetupDialog will handle manual selection
  }, [identity, defaultTown, defaultTownLoading, activeTowns, activeTownsLoading, setDefaultTown]);

  return {
    isAssigning: setDefaultTown.isPending,
    hasDefaultTown: defaultTown !== null,
    shouldShowManualDialog: isFetched && defaultTown === null && !setDefaultTown.isPending,
  };
}
