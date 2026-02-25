import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { OrderRecord } from '@/backend';

// Stub hooks - backend no longer supports pickup point order management
export function useCreatePickupOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_input: {
      items: Array<{ listingId: bigint; quantity: bigint }>;
      paymentMethod: string;
      customerName: string;
      customerPhone: string;
      deliveryAddress?: string;
    }) => {
      throw new Error('Pickup order creation is not available in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupOrders'] });
    },
  });
}

export function useListPickupOrders() {
  return useQuery({
    queryKey: ['pickupOrders'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useGetPickupOrderDetail(orderId: bigint | null) {
  return useQuery({
    queryKey: ['pickupOrderDetail', orderId?.toString()],
    queryFn: async () => null,
    enabled: orderId !== null,
    staleTime: Infinity,
  });
}
