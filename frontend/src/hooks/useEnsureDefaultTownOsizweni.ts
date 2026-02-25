import { useGetMyTownAssociation } from './useTownMembership';

// This hook is disabled as town management backend methods are not yet implemented.
export function useEnsureDefaultTownOsizweni() {
  useGetMyTownAssociation();
  // No-op: town management not available in current backend
}
