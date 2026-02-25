import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Stub hooks - backend no longer supports NomaYini
export function useGetNomaYiniBalance() {
  return useQuery({
    queryKey: ['nomayiniBalance'],
    queryFn: async () => ({ unlocked: 0n, locked: [] }),
    staleTime: Infinity,
  });
}

export function useGetNomaYiniTransactions() {
  return useQuery({
    queryKey: ['nomayiniTransactions'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useTransferNomaYini() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_input: { to: string; amount: bigint }) => {
      throw new Error('NomaYini transfers are not available in the current backend version.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nomayiniBalance'] });
      queryClient.invalidateQueries({ queryKey: ['nomayiniTransactions'] });
    },
  });
}
