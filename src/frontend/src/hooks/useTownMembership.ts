import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TownId } from './useTowns';
import { useGetCallerUserProfile } from './useUserProfiles';
import { toast } from 'sonner';

export const townMembershipKeys = {
  all: ['townMembership'] as const,
  membership: () => [...townMembershipKeys.all, 'membership'] as const,
};

// Get default town from user profile - works for all authenticated users
export function useGetDefaultTown() {
  const { data: profile, isLoading, isFetched, error } = useGetCallerUserProfile();

  return {
    data: profile?.defaultTown ?? null,
    isLoading,
    isFetched,
    error,
  };
}

// Set default town using backend selectDefaultTown method - works for all authenticated users
export function useSetDefaultTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (townId: TownId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.selectDefaultTown(townId);
    },
    onSuccess: () => {
      // Invalidate user profile to refresh default town
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Default town updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update default town:', error);
      toast.error(error.message || 'Failed to update default town');
    },
  });
}

// Placeholder for future favorite towns functionality
export function useGetAdditionalTowns() {
  return {
    data: [] as TownId[],
    isLoading: false,
    isFetched: true,
    error: null,
  };
}

export function useAddFavoriteTown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_townId: TownId) => {
      throw new Error('Favorite towns feature not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}

export function useRemoveFavoriteTown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_townId: TownId) => {
      throw new Error('Favorite towns feature not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}
