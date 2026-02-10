import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  customer: () => [...orderKeys.lists(), 'customer'] as const,
  byStatus: (status: string) => [...orderKeys.lists(), 'status', status] as const,
  byTown: (town: string) => [...orderKeys.lists(), 'town', town] as const,
  allOrders: () => [...orderKeys.lists(), 'all'] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
};

// Placeholder hooks - backend methods not yet implemented
export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useGetOrder(id: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      return null;
    },
    enabled: !!actor && !actorFetching && id > 0,
  });
}

export function useListOrdersByCustomer() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: orderKeys.customer(),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListOrdersByStatus(status: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: orderKeys.byStatus(status),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListOrdersByTown(townSuburb: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: orderKeys.byTown(townSuburb),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching && !!townSuburb,
  });
}

export function useListAllOrders() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: orderKeys.allOrders(),
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAcceptOrderAsShopper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useMarkOrderPurchased() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useMarkOrderReady() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useAcceptOrderAsDriver() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useMarkOrderDelivered() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useMarkOrderReceivedAtPickupPoint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: number) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useAddOutOfStockNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, listingId }: { orderId: number; listingId: number }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
