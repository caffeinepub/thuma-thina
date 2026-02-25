import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export interface ProductInput {
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
}

export interface Product {
  id: bigint;
  name: string;
  category: string;
  description: string;
  preferredImage?: { url: string } | null;
  imageRefs: Array<{ url: string }>;
}

// Local in-memory store for products (since backend doesn't expose product methods)
let localProducts: Product[] = [];
let nextId = BigInt(1);

export function useProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      return [...localProducts];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: bigint | undefined) {
  return useQuery<Product | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (id === undefined) return null;
      return localProducts.find(p => p.id === id) ?? null;
    },
    enabled: id !== undefined,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const product: Product = {
        id: nextId++,
        name: input.name,
        category: input.category,
        description: input.description,
        preferredImage: input.imageUrl ? { url: input.imageUrl } : null,
        imageRefs: input.imageUrl ? [{ url: input.imageUrl }] : [],
      };
      localProducts = [...localProducts, product];
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: bigint; input: ProductInput }) => {
      localProducts = localProducts.map(p =>
        p.id === id
          ? {
              ...p,
              name: input.name,
              category: input.category,
              description: input.description,
              preferredImage: input.imageUrl ? { url: input.imageUrl } : p.preferredImage,
            }
          : p
      );
      return localProducts.find(p => p.id === id) ?? null;
    },
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['catalogue'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      localProducts = localProducts.filter(p => p.id !== id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['catalogue'] });
    },
  });
}
