import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Province, Retailer, Product, ProductRequest } from '../backend';

export function useProvinces() {
  const { actor, isFetching } = useActor();

  return useQuery<Province[]>({
    queryKey: ['provinces'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProvinces();
    },
    enabled: !!actor && !isFetching
  });
}

export function useRetailersByTownSuburb(townSuburb: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Retailer[]>({
    queryKey: ['retailers', townSuburb],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRetailersByTownSuburb(townSuburb);
    },
    enabled: !!actor && !isFetching && !!townSuburb
  });
}

export function useProductCatalog(retailerId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', retailerId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductCatalog(BigInt(retailerId));
    },
    enabled: !!actor && !isFetching && !!retailerId
  });
}

export function useRequestNewProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productName: string;
      retailerName: string;
      townSuburb: string;
      province: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.requestNewProduct(
        data.productName,
        data.retailerName,
        data.townSuburb,
        data.province
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productRequests'] });
    }
  });
}
