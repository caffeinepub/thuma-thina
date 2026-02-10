import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export const retailerKeys = {
  all: ['retailers'] as const,
  lists: () => [...retailerKeys.all, 'list'] as const,
  list: (filters?: { townSuburb?: string; province?: string }) =>
    [...retailerKeys.lists(), filters] as const,
  details: () => [...retailerKeys.all, 'detail'] as const,
  detail: (id: number) => [...retailerKeys.details(), id] as const,
};

// Placeholder hooks - backend methods not yet implemented
export function useListRetailers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: retailerKeys.lists(),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRetailer(id: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: retailerKeys.detail(id),
    queryFn: async () => {
      return null;
    },
    enabled: !!actor && !actorFetching && id > 0,
  });
}

export function useCreateRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: any) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retailerKeys.all });
    },
  });
}

export function useUpdateRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: any }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: retailerKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: retailerKeys.lists() });
    },
  });
}

export function useDeleteRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retailerKeys.all });
    },
  });
}
