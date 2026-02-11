import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Retailer, NewListing, OrderRecord } from '@/backend';

export const retailerPortalKeys = {
  all: ['retailerPortal'] as const,
  myRetailer: () => [...retailerPortalKeys.all, 'myRetailer'] as const,
  inventory: () => [...retailerPortalKeys.all, 'inventory'] as const,
  orders: () => [...retailerPortalKeys.all, 'orders'] as const,
};

export function useGetMyRetailer() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Retailer | null>({
    queryKey: retailerPortalKeys.myRetailer(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyRetailer();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetMyRetailerInventory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<NewListing[]>({
    queryKey: retailerPortalKeys.inventory(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyRetailerInventory();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetMyRetailerOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: retailerPortalKeys.orders(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyRetailerOrders();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
