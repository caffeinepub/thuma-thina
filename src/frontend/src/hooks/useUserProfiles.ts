import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserRole } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export const userProfileKeys = {
  all: ['userProfiles'] as const,
  caller: () => [...userProfileKeys.all, 'caller'] as const,
  detail: (user: Principal) => [...userProfileKeys.all, 'detail', user.toString()] as const,
  byRole: (role: UserRole) => [...userProfileKeys.all, 'byRole', role] as const,
};

// Placeholder hooks - backend methods not yet implemented
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: userProfileKeys.caller(),
    queryFn: async () => {
      return null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: any) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileKeys.caller() });
    },
  });
}

export function useGetUserProfile(user: Principal) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: userProfileKeys.detail(user),
    queryFn: async () => {
      return null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListUsersByRole(role: UserRole) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: userProfileKeys.byRole(role),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}
