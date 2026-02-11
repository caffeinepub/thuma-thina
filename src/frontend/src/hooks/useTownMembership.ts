import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TownId } from './useTowns';
import type { Principal } from '@icp-sdk/core/principal';

export const townMembershipKeys = {
  all: ['townMembership'] as const,
  defaultTown: () => [...townMembershipKeys.all, 'default'] as const,
  additionalTowns: () => [...townMembershipKeys.all, 'additional'] as const,
  applications: () => [...townMembershipKeys.all, 'applications'] as const,
  adminApplications: () => [...townMembershipKeys.all, 'admin', 'applications'] as const,
};

// User queries
export function useGetDefaultTown() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TownId | null>({
    queryKey: townMembershipKeys.defaultTown(),
    queryFn: async () => {
      // Backend method not yet implemented
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAdditionalTowns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TownId[]>({
    queryKey: townMembershipKeys.additionalTowns(),
    queryFn: async () => {
      // Backend method not yet implemented
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetDefaultTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (townId: TownId) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}

export function useApplyForAdditionalTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (townId: TownId) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.applications() });
    },
  });
}

// Admin mutations
export function useApproveAdditionalTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}

export function useRejectAdditionalTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicant, reason }: { applicant: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townMembershipKeys.all });
    },
  });
}
