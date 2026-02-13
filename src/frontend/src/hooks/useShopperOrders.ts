import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OrderRecord, OrderId, ShopperOrderView } from '@/backend';

export const shopperOrderKeys = {
  all: ['shopperOrders'] as const,
  eligible: () => [...shopperOrderKeys.all, 'eligible'] as const,
  assigned: () => [...shopperOrderKeys.all, 'assigned'] as const,
  detail: (id: number) => [...shopperOrderKeys.all, 'detail', id] as const,
};

export function useListShopperEligibleOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: shopperOrderKeys.eligible(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listShopperEligiblePickupOrders();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useListMyAssignedShopperOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: shopperOrderKeys.assigned(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listMyAssignedShopperOrders();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
  });
}

export function useGetShopperOrderDetails(orderId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ShopperOrderView | null>({
    queryKey: shopperOrderKeys.detail(orderId),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getShopperOrderExpanded(BigInt(orderId) as OrderId);
    },
    enabled: !!actor && !actorFetching && orderId > 0,
  });
}

export function useAcceptShopperOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptShopperOrder(BigInt(orderId) as OrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopperOrderKeys.eligible() });
      queryClient.invalidateQueries({ queryKey: shopperOrderKeys.assigned() });
    },
  });
}

export function useCompleteShopperOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeShopperOrder(BigInt(orderId) as OrderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shopperOrderKeys.eligible() });
      queryClient.invalidateQueries({ queryKey: shopperOrderKeys.assigned() });
    },
  });
}
