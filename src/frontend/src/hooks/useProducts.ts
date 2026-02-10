import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// Placeholder hooks - backend methods not yet implemented
export function useListProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(id: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      return null;
    },
    enabled: !!actor && !actorFetching && id > 0,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      category,
      description,
    }: {
      name: string;
      category: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      category,
      description,
    }: {
      id: number;
      name: string;
      category: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
