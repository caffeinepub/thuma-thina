import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// System wipe mutation
export function useWipeSystem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Backend method not yet implemented: System wipe functionality');
    },
    onSuccess: () => {
      // Clear all cached queries after successful wipe
      queryClient.clear();
    },
  });
}
