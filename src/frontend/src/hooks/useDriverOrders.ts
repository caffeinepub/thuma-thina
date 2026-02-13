import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OrderRecord } from '@/backend';

export const driverOrderKeys = {
  all: ['driverOrders'] as const,
  eligible: () => [...driverOrderKeys.all, 'eligible'] as const,
};

export function useListEligibleDriverOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: driverOrderKeys.eligible(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listEligibleDriverOrders();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Poll every 10 seconds (same as shopper dashboard)
  });
}
