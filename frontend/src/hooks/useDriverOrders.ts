import { useQuery } from '@tanstack/react-query';
import { OrderRecord } from '@/backend';

// Stub hook - backend no longer supports driver order management
export function useListDriverEligibleOrders() {
  return useQuery<OrderRecord[]>({
    queryKey: ['driverEligibleOrders'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}
