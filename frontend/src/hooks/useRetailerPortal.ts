import { useQuery } from '@tanstack/react-query';

// Stub hooks - backend no longer supports retailer portal
export function useGetMyRetailer() {
  return useQuery({
    queryKey: ['myRetailer'],
    queryFn: async () => null,
    staleTime: Infinity,
  });
}

export function useGetMyRetailerInventory() {
  return useQuery({
    queryKey: ['myRetailerInventory'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}

export function useGetMyRetailerOrders() {
  return useQuery({
    queryKey: ['myRetailerOrders'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}
