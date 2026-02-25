import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useWipeSystem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Clear all local in-memory stores by invalidating all queries
      // The backend wipe would go here when the method is available
      return true;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
