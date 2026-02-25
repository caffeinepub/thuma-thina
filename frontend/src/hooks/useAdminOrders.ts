import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { OrderRecord } from '@/backend';

// Stub hooks - backend no longer supports full order management
export function useListAllOrders() {
  return useQuery<OrderRecord[]>({
    queryKey: ['adminOrders'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_input: { orderId: bigint; status: string; assigneeId?: string }) => {
      throw new Error('Order management is not available in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
}
