import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { OrderRecord } from '@/backend';

// Stub hooks - backend no longer supports full order management
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_input: {
      items: Array<{ listingId: bigint; quantity: bigint }>;
      deliveryMethod: { type: string; address?: string; pointId?: bigint };
      paymentMethod: string;
    }) => {
      throw new Error('Order creation is not available in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
    },
  });
}

export function useListMyOrders() {
  return useQuery<OrderRecord[]>({
    queryKey: ['myOrders'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useGetOrderDetail(orderId: bigint | null) {
  return useQuery({
    queryKey: ['orderDetail', orderId?.toString()],
    queryFn: async () => null,
    enabled: orderId !== null,
    staleTime: Infinity,
  });
}
