import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface OpeningHours {
  weeklySchedule: Array<{ day: number; openTime: number; closeTime: number }>;
  holidayOverrides: Array<{
    date: bigint;
    isOpen: boolean;
    openTime?: number;
    closeTime?: number;
    name: string;
  }>;
}

export interface Retailer {
  id: bigint;
  name: string;
  townSuburb: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface RetailerInput {
  name: string;
  townSuburb: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  openingHours: OpeningHours;
}

let localRetailers: Retailer[] = [];
let nextId = BigInt(1);

export function useRetailers() {
  const { actor, isFetching } = useActor();

  return useQuery<Retailer[]>({
    queryKey: ['retailers'],
    queryFn: async () => {
      return [...localRetailers];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRetailer(id: bigint | undefined) {
  return useQuery<Retailer | null>({
    queryKey: ['retailer', id?.toString()],
    queryFn: async () => {
      if (id === undefined) return null;
      return localRetailers.find(r => r.id === id) ?? null;
    },
    enabled: id !== undefined,
  });
}

export function useCreateRetailer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RetailerInput) => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      const retailer: Retailer = {
        id: nextId++,
        ...input,
        createdAt: now,
        updatedAt: now,
      };
      localRetailers = [...localRetailers, retailer];
      return retailer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
    },
  });
}

export function useUpdateRetailer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: RetailerInput }) => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      localRetailers = localRetailers.map(r =>
        r.id === id ? { ...r, ...input, updatedAt: now } : r
      );
      return localRetailers.find(r => r.id === id) ?? null;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
      queryClient.invalidateQueries({ queryKey: ['retailer', id.toString()] });
    },
  });
}

export function useDeleteRetailer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      localRetailers = localRetailers.filter(r => r.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
    },
  });
}
