import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export const townKeys = {
  all: ['towns'] as const,
  lists: () => [...townKeys.all, 'list'] as const,
};

// Placeholder hooks - backend methods not yet implemented
export function useListTowns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: townKeys.lists(),
    queryFn: async () => {
      return [];
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
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townKeys.all });
    },
  });
}

export function useDeleteTown() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, province }: { name: string; province: string }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: townKeys.all });
    },
  });
}
