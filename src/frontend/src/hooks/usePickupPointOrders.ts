import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PickupOrder, PickupOrderInput } from '@/backend';

export function useCreatePickupOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PickupOrderInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPickupOrder(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupOrders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue'] });
    },
  });
}

export function useListMyPickupOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PickupOrder[]>({
    queryKey: ['pickupOrders'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listMyPickupOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPickupOrderForOrderId(orderId: number) {
  const { data: pickupOrders } = useListMyPickupOrders();

  return pickupOrders?.find((po) => Number(po.orderRecord.id) === orderId) || null;
}
