import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Town, TownId } from '@/backend';

export const townKeys = {
  all: ['towns'] as const,
  lists: () => [...townKeys.all, 'list'] as const,
};

export function useListTowns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Town[]>({
    queryKey: townKeys.lists(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listTowns();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, province }: { name: string; province: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTown(name, province);
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
      return actor.updateTown(id, name, province);
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
      return actor.removeTown(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townKeys.all });
    },
  });
}
