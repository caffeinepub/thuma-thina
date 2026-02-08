import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Province, RetailerWithListings, Listing, ProductRequest, Product, ProductWithRetailers, ListingStatus } from '../backend';

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

  return useQuery<RetailerWithListings[]>({
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

  return useQuery<Listing[]>({
    queryKey: ['listings', retailerId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductCatalog(BigInt(retailerId));
    },
    enabled: !!actor && !isFetching && !!retailerId
  });
}

export function useProductWithRetailers(productId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductWithRetailers | null>({
    queryKey: ['productWithRetailers', productId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProductWithRetailers(BigInt(productId));
      } catch (error) {
        console.error('Error fetching product with retailers:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!productId
  });
}

export function useCataloguePreview() {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['cataloguePreview'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const listings = await actor.getAllActiveListings();
        // Return first 8 listings for preview
        return listings.slice(0, 8);
      } catch (error) {
        console.error('Error fetching catalogue preview:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching
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
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    }
  });
}

// Role Application Hooks

export function useSubmitRoleApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { role: string; motivation: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.submitRoleApplication(data.role, data.motivation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myRoleApplications'] });
    }
  });
}

export function useMyRoleApplications() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['myRoleApplications'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-expect-error - Backend method will be implemented
      return actor.getMyRoleApplications();
    },
    enabled: !!actor && !isFetching
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false
  });
}

export function usePendingRoleApplications() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['pendingRoleApplications'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-expect-error - Backend method will be implemented
      return actor.listPendingRoleApplications();
    },
    enabled: !!actor && !isFetching
  });
}

export function useApproveRoleApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.approveRoleApplication(applicationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRoleApplications'] });
      queryClient.invalidateQueries({ queryKey: ['myRoleApplications'] });
    }
  });
}

export function useRejectRoleApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { applicationId: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.rejectRoleApplication(data.applicationId, data.reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRoleApplications'] });
      queryClient.invalidateQueries({ queryKey: ['myRoleApplications'] });
    }
  });
}

// Admin Dashboard Hooks

export function useDashboardData() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    retailers: bigint;
    products: bigint;
    listings: bigint;
    requests: bigint;
  }>({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getDashboardData();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      description: string;
      imageRef: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addProduct(data.name, data.category, data.description, data.imageRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
    }
  });
}

export function useAddRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      townSuburb: string;
      province: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addRetailer(data.name, data.townSuburb, data.province);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
    }
  });
}

export function useAddListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      retailerId: bigint;
      productId: bigint;
      price: bigint;
      stock: bigint;
      status: ListingStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addListing(data.retailerId, data.productId, data.price, data.stock, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
    }
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['allProducts'],
    queryFn: async () => {
      if (!actor) return [];
      // Get all active listings and extract unique products
      const listings = await actor.getAllActiveListings();
      const productIds = [...new Set(listings.map(l => l.productId.toString()))];
      const products: Product[] = [];
      
      for (const productId of productIds) {
        try {
          const productWithRetailers = await actor.getProductWithRetailers(BigInt(productId));
          if (productWithRetailers) {
            products.push(productWithRetailers.product);
          }
        } catch (error) {
          console.error(`Error fetching product ${productId}:`, error);
        }
      }
      
      return products;
    },
    enabled: !!actor && !isFetching
  });
}

export function useAllRetailers() {
  const { actor, isFetching } = useActor();

  return useQuery<RetailerWithListings[]>({
    queryKey: ['allRetailers'],
    queryFn: async () => {
      if (!actor) return [];
      const provinces = await actor.getProvinces();
      const allRetailers: RetailerWithListings[] = [];
      
      for (const province of provinces) {
        for (const town of province.towns) {
          try {
            const retailers = await actor.getRetailersByTownSuburb(town);
            allRetailers.push(...retailers);
          } catch (error) {
            console.error(`Error fetching retailers for ${town}:`, error);
          }
        }
      }
      
      return allRetailers;
    },
    enabled: !!actor && !isFetching
  });
}
