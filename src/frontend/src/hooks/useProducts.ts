import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { catalogKeys } from './useCatalog';
import { categoryKeys } from './useCategories';
import type { Product, ProductId, ExternalBlob } from '@/backend';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export function useListProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(id: number) {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: products } = useListProducts();

  return useQuery<Product | null>({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      if (!products) return null;
      return products.find((p) => Number(p.id) === id) || null;
    },
    enabled: !!actor && !actorFetching && id > 0 && !!products,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      description,
      image,
      category,
    }: {
      name: string;
      description: string;
      image: ExternalBlob;
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(name, description, image, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      category,
    }: {
      id: ProductId;
      name: string;
      description: string;
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, name, description, category);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(Number(variables.id)) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: catalogKeys.all });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
