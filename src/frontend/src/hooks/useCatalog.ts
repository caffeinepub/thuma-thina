import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ShopProduct } from '@/backend';

export const catalogKeys = {
  all: ['catalog'] as const,
  global: () => [...catalogKeys.all, 'global'] as const,
};

export function useGlobalCatalogue() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ShopProduct[]>({
    queryKey: catalogKeys.global(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCatalogue();
    },
    enabled: !!actor && !actorFetching,
  });
}
