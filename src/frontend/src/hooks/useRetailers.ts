import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Retailer, RetailerId, RetailerInput } from '@/backend';

export const retailerKeys = {
  all: ['retailers'] as const,
  lists: () => [...retailerKeys.all, 'list'] as const,
  list: (filters?: { townSuburb?: string; province?: string }) =>
    [...retailerKeys.lists(), filters] as const,
  details: () => [...retailerKeys.all, 'detail'] as const,
  detail: (id: number) => [...retailerKeys.details(), id] as const,
};

export function useListRetailers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Retailer[]>({
    queryKey: retailerKeys.lists(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listRetailers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetRetailer(id: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Retailer | null>({
    queryKey: retailerKeys.detail(id),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRetailer(BigInt(id));
    },
    enabled: !!actor && !actorFetching && id > 0,
  });
}

export function useCreateRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RetailerInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRetailer(input);
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
    mutationFn: async ({ id, input }: { id: RetailerId; input: RetailerInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRetailer(id, input);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: retailerKeys.detail(Number(variables.id)) });
      queryClient.invalidateQueries({ queryKey: retailerKeys.lists() });
    },
  });
}

export function useDeleteRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: RetailerId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteRetailer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retailerKeys.all });
    },
  });
}
