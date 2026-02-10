import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { productKeys } from './useProducts';
import { retailerKeys } from './useRetailers';

export const listingKeys = {
  all: ['listings'] as const,
  lists: () => [...listingKeys.all, 'list'] as const,
  list: (filters?: { retailerId?: number; productId?: number }) =>
    [...listingKeys.lists(), filters] as const,
  details: () => [...listingKeys.all, 'detail'] as const,
  detail: (id: number) => [...listingKeys.details(), id] as const,
  active: () => [...listingKeys.all, 'active'] as const,
};

// Placeholder hooks - backend methods not yet implemented
export function useListListings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: listingKeys.lists(),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListListingsByRetailer(retailerId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: listingKeys.list({ retailerId }),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching && retailerId > 0,
  });
}

export function useListActiveListings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: listingKeys.active(),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      retailerId,
      productId,
      price,
      stock,
    }: {
      retailerId: number;
      productId: number;
      price: number;
      stock: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: retailerKeys.all });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      price,
      stock,
      status,
    }: {
      id: number;
      price: number;
      stock: number;
      status: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: listingKeys.active() });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
    },
  });
}
