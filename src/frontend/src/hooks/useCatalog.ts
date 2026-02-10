import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export const catalogKeys = {
  all: ['catalog'] as const,
  global: () => [...catalogKeys.all, 'global'] as const,
};

// Placeholder hook - backend method not yet implemented
export function useGlobalCatalogue() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: catalogKeys.global(),
    queryFn: async () => {
      // Return empty array until backend implements getGlobalCatalogue
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}
