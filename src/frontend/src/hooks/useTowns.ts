import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Temporary type definitions until backend exports these
export type TownId = bigint;
export type TownStatus = 'active' | 'removed';
export interface Town {
  id: TownId;
  name: string;
  province: string;
  status: TownStatus;
  createdAt: bigint;
  updatedAt: bigint;
}

export const townKeys = {
  all: ['towns'] as const,
  lists: () => [...townKeys.all, 'list'] as const,
  active: () => [...townKeys.all, 'active'] as const,
};

export function useListTowns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Town[]>({
    queryKey: townKeys.lists(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town management backend methods not yet implemented');
    },
    enabled: false, // Disabled until backend is ready
  });
}

export function useActiveTowns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Town[]>({
    queryKey: townKeys.active(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town management backend methods not yet implemented');
    },
    enabled: false, // Disabled until backend is ready
  });
}

export function useCreateTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, province }: { name: string; province: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town management backend methods not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townKeys.all });
    },
  });
}

export function useUpdateTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, province }: { id: TownId; name: string; province: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town management backend methods not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townKeys.all });
    },
  });
}

export function useRemoveTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: TownId) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Town management backend methods not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townKeys.all });
    },
  });
}
