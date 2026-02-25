import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface Town {
  id: bigint;
  name: string;
  province: string;
  status: { __kind__: 'active' } | { __kind__: 'removed' };
  createdAt: bigint;
  updatedAt: bigint;
}

export interface TownInput {
  name: string;
  province: string;
}

export type TownId = bigint;

let localTowns: Town[] = [
  {
    id: BigInt(1),
    name: 'Osizweni',
    province: 'KwaZulu-Natal',
    status: { __kind__: 'active' },
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
  {
    id: BigInt(2),
    name: 'Newcastle',
    province: 'KwaZulu-Natal',
    status: { __kind__: 'active' },
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
];
let nextId = BigInt(3);

export function useListTowns() {
  const { actor, isFetching } = useActor();

  return useQuery<Town[]>({
    queryKey: ['towns'],
    queryFn: async () => {
      return [...localTowns];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListActiveTowns() {
  const { actor, isFetching } = useActor();

  return useQuery<Town[]>({
    queryKey: ['towns', 'active'],
    queryFn: async () => {
      return localTowns.filter(t => t.status.__kind__ === 'active');
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: TownInput) => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      const town: Town = {
        id: nextId++,
        name: input.name,
        province: input.province,
        status: { __kind__: 'active' },
        createdAt: now,
        updatedAt: now,
      };
      localTowns = [...localTowns, town];
      return town;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towns'] });
    },
  });
}

export function useUpdateTown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: TownInput }) => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      localTowns = localTowns.map(t =>
        t.id === id ? { ...t, name: input.name, province: input.province, updatedAt: now } : t
      );
      return localTowns.find(t => t.id === id) ?? null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towns'] });
    },
  });
}

export function useRemoveTown() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      const now = BigInt(Date.now()) * BigInt(1_000_000);
      localTowns = localTowns.map(t =>
        t.id === id ? { ...t, status: { __kind__: 'removed' as const }, updatedAt: now } : t
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['towns'] });
    },
  });
}
