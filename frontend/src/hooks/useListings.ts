import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ListingInput {
  retailerId: bigint;
  productId: bigint;
  price: bigint;
  stock: bigint;
  status: 'active' | 'outOfStock' | 'discontinued';
}

export interface Listing {
  id: bigint;
  retailerId: bigint;
  productId: bigint;
  price: bigint;
  promo: null | { price: bigint; startDate: bigint; endDate?: bigint };
  stock: bigint;
  status: { __kind__: 'active' } | { __kind__: 'outOfStock' } | { __kind__: 'discontinued' };
  createdAt: bigint;
  updatedAt: bigint;
}

let localListings: Listing[] = [];
let nextId = BigInt(1);

export function useListings() {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      return [...localListings];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListing(id: bigint | undefined) {
  return useQuery<Listing | null>({
    queryKey: ['listing', id?.toString()],
    queryFn: async () => {
      if (id === undefined) return null;
      return localListings.find(l => l.id === id) ?? null;
    },
    enabled: id !== undefined,
  });
}

export function useCreateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ListingInput) => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      const listing: Listing = {
        id: nextId++,
        retailerId: input.retailerId,
        productId: input.productId,
        price: input.price,
        promo: null,
        stock: input.stock,
        status: { __kind__: input.status },
        createdAt: now,
        updatedAt: now,
      };
      localListings = [...localListings, listing];
      return listing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ListingInput }) => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      localListings = localListings.map(l =>
        l.id === id
          ? {
              ...l,
              retailerId: input.retailerId,
              productId: input.productId,
              price: input.price,
              stock: input.stock,
              status: { __kind__: input.status },
              updatedAt: now,
            }
          : l
      );
      return localListings.find(l => l.id === id) ?? null;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['catalogue'] });
    },
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      localListings = localListings.filter(l => l.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue'] });
    },
  });
}
