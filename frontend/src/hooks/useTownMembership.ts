import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Stub hooks - backend no longer supports town membership
export function useGetMyTownAssociation() {
  return useQuery({
    queryKey: ['myTownAssociation'],
    queryFn: async () => null,
    staleTime: Infinity,
  });
}

export function useSetMyTownAssociation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_townId: bigint) => {
      throw new Error('Town membership is not available in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myTownAssociation'] });
    },
  });
}
