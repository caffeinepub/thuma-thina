import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OrderRecord, OrderStatus, OrderId } from '@/backend';

// Query keys
export const adminOrderKeys = {
  allOrders: ['adminOrders', 'all'] as const,
  orderDetail: (id: OrderId) => ['adminOrders', 'detail', id.toString()] as const,
};

// List all orders (admin only)
export function useListAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: adminOrderKeys.allOrders,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listAllOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Update order status (admin only)
export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: OrderId; status: OrderStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrderStatus(orderId, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.allOrders });
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.orderDetail(variables.orderId) });
    },
  });
}
