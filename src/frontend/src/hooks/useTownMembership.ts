import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TownId } from './useTowns';

// Temporary type definition until backend exports this
export interface TownMembership {
  default: TownId;
  additional: TownId[];
}

export const townMembershipKeys = {
  all: ['townMembership'] as const,
  membership: () => [...townMembershipKeys.all, 'membership'] as const,
};

// Get full town membership (default + additional)
export function useGetTownMembership() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TownMembership>({
    queryKey: townMembershipKeys.membership(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town membership backend methods not yet implemented');
    },
    enabled: false, // Disabled until backend is ready
  });
}

// Derived query for default town
export function useGetDefaultTown() {
  const query = useGetTownMembership();

  return {
    data: query.data?.default ?? null,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error,
  };
}

// Derived query for additional towns
export function useGetAdditionalTowns() {
  const query = useGetTownMembership();

  return {
    data: query.data?.additional ?? [],
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    error: query.error,
  };
}

// Set default town
export function useSetDefaultTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (townId: TownId) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town membership backend methods not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}

// Add favorite town (no approval needed)
export function useAddFavoriteTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (townId: TownId) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town membership backend methods not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}

// Remove favorite town
export function useRemoveFavoriteTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (townId: TownId) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town membership backend methods not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}
