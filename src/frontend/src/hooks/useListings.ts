import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { productKeys } from './useProducts';
import { retailerKeys } from './useRetailers';
import { catalogKeys } from './useCatalog';
import type { NewListing, ListingId, RetailerId, ProductId, ListingStatus } from '@/backend';

export const listingKeys = {
  all: ['listings'] as const,
  lists: () => [...listingKeys.all, 'list'] as const,
  list: (filters?: { retailerId?: number; productId?: number }) =>
    [...listingKeys.lists(), filters] as const,
  details: () => [...listingKeys.all, 'detail'] as const,
  detail: (id: number) => [...listingKeys.details(), id] as const,
  active: () => [...listingKeys.all, 'active'] as const,
};

export function useListListings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewListing[]>({
    queryKey: listingKeys.lists(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listAllListings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListListingsByRetailer(retailerId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewListing[]>({
    queryKey: listingKeys.list({ retailerId }),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRetailerListings(BigInt(retailerId) as RetailerId);
    },
    enabled: !!actor && !actorFetching && retailerId > 0,
  });
}

export function useGetListing(id: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewListing | null>({
    queryKey: listingKeys.detail(id),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getListing(BigInt(id) as ListingId);
    },
    enabled: !!actor && !actorFetching && id > 0,
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
      retailerId: RetailerId;
      productId: ProductId;
      price: bigint;
      stock: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createListing(retailerId, productId, price, stock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: retailerKeys.all });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
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
      id: ListingId;
      price: bigint;
      stock: bigint;
      status: ListingStatus;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateListing(id, price, stock, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(Number(variables.id)) });
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listingKeys.all });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useSetPromo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      price,
      startDate,
      endDate,
    }: {
      id: ListingId;
      price: bigint;
      startDate: bigint;
      endDate: bigint | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setPromo(id, price, startDate, endDate);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(Number(variables.id)) });
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}

export function useRemovePromo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: ListingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePromo(id);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: listingKeys.detail(Number(id)) });
      queryClient.invalidateQueries({ queryKey: listingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}
