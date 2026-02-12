import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import type { PersonalShopperApplication } from '@/backend';

// Type definitions matching backend structures
export interface DriverApplication {
  applicant: Principal;
  name: string;
  email: string;
  phone: string;
  vehicleDetails: string;
  kycDocs: any[];
  status:
    | { __kind__: 'pending' }
    | { __kind__: 'approved' }
    | { __kind__: 'rejected'; rejected: string };
  submittedAt: bigint;
  reviewedBy: Principal | null;
}

export interface ShopperApplication {
  applicant: Principal;
  name: string;
  email: string;
  address: string;
  kycDocs: any[];
  status:
    | { __kind__: 'pending' }
    | { __kind__: 'approved' }
    | { __kind__: 'rejected'; rejected: string };
  submittedAt: bigint;
  reviewedBy: Principal | null;
}

// Query keys
export const roleApplicationKeys = {
  driverApplications: ['driverApplications'] as const,
  shopperApplications: ['shopperApplications'] as const,
  pickupPointApplications: ['pickupPointApplications'] as const,
  myShopperApplication: ['myShopperApplication'] as const,
};

// Driver Applications (Admin)
export function useDriverApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DriverApplication[]>({
    queryKey: roleApplicationKeys.driverApplications,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented - return empty array for now
      return [] as DriverApplication[];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveDriver() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Backend method not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.driverApplications });
    },
  });
}

export function useRejectDriver() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicant, reason }: { applicant: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented
      throw new Error('Backend method not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.driverApplications });
    },
  });
}

// Shopper Applications (Admin)
export function useShopperApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PersonalShopperApplication[]>({
    queryKey: roleApplicationKeys.shopperApplications,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listPendingPersonalShopperApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveShopper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.approvePersonalShopper(applicant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.shopperApplications });
    },
  });
}

export function useRejectShopper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicant, reason }: { applicant: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.rejectPersonalShopper(applicant, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.shopperApplications });
    },
  });
}
