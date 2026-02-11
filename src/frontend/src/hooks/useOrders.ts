import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { catalogKeys } from './useCatalog';
import { PaymentMethod } from '@/backend';
import type { OrderRecord, OrderId, CartItem, DeliveryMethod } from '@/backend';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  myOrders: () => [...orderKeys.lists(), 'my'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

export function useListOrdersByCustomer() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: orderKeys.myOrders(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyOrders();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetOrder(orderId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OrderRecord | null>({
    queryKey: orderKeys.detail(orderId),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getOrder(BigInt(orderId) as OrderId);
    },
    enabled: !!actor && !actorFetching && orderId > 0,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      items,
      deliveryType,
      deliveryAddress,
      pickupPointId,
      paymentType,
    }: {
      items: Array<{ listingId: string; quantity: number }>;
      deliveryType: 'home' | 'pickupPoint';
      deliveryAddress?: string;
      pickupPointId?: string;
      paymentType: 'zar' | 'icp' | 'nomayini';
    }) => {
      if (!actor) throw new Error('Actor not available');

      // Convert cart items to backend format
      const cartItems: CartItem[] = items.map((item) => ({
        listingId: BigInt(item.listingId),
        quantity: BigInt(item.quantity),
      }));

      // Build delivery method
      let deliveryMethod: DeliveryMethod;
      if (deliveryType === 'home') {
        if (!deliveryAddress) throw new Error('Delivery address is required');
        deliveryMethod = {
          __kind__: 'home',
          home: { address: deliveryAddress },
        };
      } else {
        if (!pickupPointId) throw new Error('Pickup point ID is required');
        deliveryMethod = {
          __kind__: 'pickupPoint',
          pickupPoint: { pointId: BigInt(pickupPointId) },
        };
      }

      // Build payment method
      let paymentMethod: PaymentMethod;
      switch (paymentType) {
        case 'zar':
          paymentMethod = PaymentMethod.zar;
          break;
        case 'icp':
          paymentMethod = PaymentMethod.icp;
          break;
        case 'nomayini':
          paymentMethod = PaymentMethod.nomayini;
          break;
        default:
          throw new Error('Invalid payment method');
      }

      return actor.createOrder(cartItems, deliveryMethod, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
    },
  });
}
