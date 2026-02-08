import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useRef, useEffect } from 'react';

const BOOTSTRAP_SESSION_KEY = 'admin_bootstrap_attempted';

export function useBootstrapAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const hasAttemptedRef = useRef(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      // Call bootstrap with empty tokens - backend will handle first-user logic
      await actor.bootstrapAdmin('', '');
    },
    onSuccess: () => {
      // Mark as attempted in session
      sessionStorage.setItem(BOOTSTRAP_SESSION_KEY, 'true');
      // Invalidate admin-related queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
    onError: (error) => {
      // Silently handle errors - bootstrap may fail if already closed
      console.log('Bootstrap attempt completed:', error);
      sessionStorage.setItem(BOOTSTRAP_SESSION_KEY, 'true');
    },
    retry: false
  });

  useEffect(() => {
    // Only attempt once per session and when actor is available
    const hasAttempted = sessionStorage.getItem(BOOTSTRAP_SESSION_KEY) === 'true';
    
    if (actor && !hasAttempted && !hasAttemptedRef.current && !mutation.isPending) {
      hasAttemptedRef.current = true;
      mutation.mutate();
    }
  }, [actor, mutation]);

  return mutation;
}
