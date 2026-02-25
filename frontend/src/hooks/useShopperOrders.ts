import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { OrderRecord } from '@/backend';

// Stub hooks - backend no longer supports shopper order management
export function useListEligibleOrders() {
  return useQuery<OrderRecord[]>({
    queryKey: ['eligibleOrders'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useListAssignedOrders() {
  return useQuery<OrderRecord[]>({
    queryKey: ['assignedOrders'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function usePendingOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: ['pendingOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingOrders();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useGetShopperOrderDetail(orderId: bigint | null) {
  return useQuery({
    queryKey: ['shopperOrderDetail', orderId?.toString()],
    queryFn: async () => null,
    enabled: orderId !== null,
    staleTime: Infinity,
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_orderId: bigint) => {
      throw new Error('Order acceptance is not available in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eligibleOrders'] });
      queryClient.invalidateQueries({ queryKey: ['assignedOrders'] });
    },
  });
}

export function useCompleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_orderId: bigint) => {
      throw new Error('Order completion is not available in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignedOrders'] });
    },
  });
}
