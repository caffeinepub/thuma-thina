import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Province, RetailerWithListings, Listing, ProductRequest, Product, ProductWithRetailers, ListingStatus, ProductId, RetailerId, RetailerInput, Retailer, UserRole, ListingId } from '../backend';
import { ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';

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

export function useAdminAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      try {
        // For now, return mock data structure
        // Backend doesn't have SalesAnalytics endpoint yet
        return {
          totalSales: BigInt(0),
          ordersCount: BigInt(0),
          deliveriesCount: BigInt(0),
          activeShoppers: BigInt(0),
          activeDrivers: BigInt(0),
          favouriteProducts: [] as Product[],
          favouriteRetailers: [] as any[]
        };
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          throw new Error('You must be an admin to view analytics');
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false
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
      preferredImage?: File;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      let imageBlob: ExternalBlob | null = null;
      if (data.preferredImage) {
        const arrayBuffer = await data.preferredImage.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        imageBlob = ExternalBlob.fromBytes(uint8Array);
      }
      
      return actor.addProduct(data.name, data.category, data.description, imageBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    }
  });
}

export function useAddRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RetailerInput) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addRetailer(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
      queryClient.invalidateQueries({ queryKey: ['allRetailers'] });
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
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers'] });
    }
  });
}

export function useAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['allProducts'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listProducts();
      } catch (error) {
        console.error('Error fetching all products:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching
  });
}

export function useAllRetailers() {
  const { actor, isFetching } = useActor();

  return useQuery<Retailer[]>({
    queryKey: ['allRetailers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listRetailers();
      } catch (error) {
        console.error('Error fetching all retailers:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching
  });
}

// Listing Management Hooks

export function useAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<Listing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listListings();
      } catch (error) {
        console.error('Error fetching all listings:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      listingId: ListingId;
      price?: bigint;
      stock?: bigint;
      status?: ListingStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.adminUpdateListing(
        data.listingId,
        data.price ?? null,
        data.stock ?? null,
        data.status ?? null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers'] });
    }
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: ListingId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.adminDeleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers'] });
    }
  });
}

// Retailer Management Hooks

export function useUpdateRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      input: RetailerInput;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateRetailer(data.id, data.input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    }
  });
}

export function useRemoveRetailer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (retailerId: RetailerId) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend removeRetailer method exists but not in current interface
      return actor.removeRetailer(retailerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['retailers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    }
  });
}

export function useRemoveProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: ProductId) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend removeProduct method exists but not in current interface
      return actor.removeProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    }
  });
}

export function useRetailerOpenStatus(retailerId: RetailerId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['retailerOpenStatus', retailerId?.toString()],
    queryFn: async () => {
      if (!actor || !retailerId) return false;
      return actor.isRetailerOpen(retailerId, null);
    },
    enabled: !!actor && !isFetching && !!retailerId,
    refetchInterval: 60000 // Refetch every minute to keep status current
  });
}

// Product Image Management Hooks

export function useAddImageRef() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: ProductId;
      imageFile: File;
      onProgress?: (percentage: number) => void;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      const arrayBuffer = await data.imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let imageBlob = ExternalBlob.fromBytes(uint8Array);
      
      if (data.onProgress) {
        imageBlob = imageBlob.withUploadProgress(data.onProgress);
      }
      
      return actor.addImageRef(data.productId, imageBlob);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers', variables.productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['previewProducts'] });
    }
  });
}

export function useSetPreferredImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: ProductId;
      preferredImage: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setPreferredImage(data.productId, data.preferredImage);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers', variables.productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['previewProducts'] });
    }
  });
}

export function useRemoveImage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: ProductId;
      imageIndex: bigint;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.removeImage(data.productId, data.imageIndex);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers', variables.productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['previewProducts'] });
    }
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: ProductId;
      name: string;
      category: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.updateProduct(data.productId, data.name, data.category, data.description);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['productWithRetailers', variables.productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['cataloguePreview'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    }
  });
}

export function useWipeSystem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.wipeSystem();
    },
    onSuccess: () => {
      // Clear all React Query caches related to catalog and admin state
      queryClient.clear();
    }
  });
}

// Order Management Hooks

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest' as UserRole;
      try {
        return await actor.getCallerUserRole();
      } catch (error) {
        console.error('Error fetching user role:', error);
        return 'guest' as UserRole;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      listingId: bigint;
      quantity: bigint;
      deliveryAddress: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.createOrder(data.listingId, data.quantity, data.deliveryAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placedOrders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    }
  });
}

export function usePlacedOrders() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['placedOrders'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-expect-error - Backend method will be implemented
      return actor.listPlacedOrders();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAcceptOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.acceptOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placedOrders'] });
    }
  });
}

export function useMarkShoppingDone() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.markShoppingDone(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['placedOrders'] });
      queryClient.invalidateQueries({ queryKey: ['readyForDeliveryOrders'] });
    }
  });
}

export function useReadyForDeliveryOrders() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['readyForDeliveryOrders'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-expect-error - Backend method will be implemented
      return actor.listReadyForDeliveryOrders();
    },
    enabled: !!actor && !isFetching
  });
}

export function useAcceptDelivery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.acceptDelivery(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readyForDeliveryOrders'] });
    }
  });
}

export function useMarkDelivered() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      // @ts-expect-error - Backend method will be implemented
      return actor.markDelivered(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['readyForDeliveryOrders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
    }
  });
}
