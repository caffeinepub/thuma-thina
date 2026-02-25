import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

export interface PersonalShopperApplication {
  applicant: Principal;
  name: string;
  email: string;
  phone: string;
  selfieImage: { url: string };
  status: { __kind__: 'pending' } | { __kind__: 'approved' } | { __kind__: 'rejected'; rejected: string };
  submittedAt: bigint;
  reviewedBy?: Principal;
  reviewedAt?: bigint;
  rejectionReason?: string;
}

export interface DriverApplication {
  applicant: Principal;
  name: string;
  email: string;
  phone: string;
  vehicleDetails: string;
  kycDocs: Array<{ url: string }>;
  status: { __kind__: 'pending' } | { __kind__: 'approved' } | { __kind__: 'rejected'; rejected: string };
  submittedAt: bigint;
  reviewedBy?: Principal;
}

export interface PickupPointApplication {
  applicant: Principal;
  name: string;
  address: string;
  contactNumber: string;
  businessImage: { url: string };
  townId?: bigint;
  status: { __kind__: 'pending' } | { __kind__: 'approved' } | { __kind__: 'rejected'; rejected: string };
  submittedAt: bigint;
  reviewedBy?: Principal;
}

// Local stores for applications
let localShopperApps: PersonalShopperApplication[] = [];
let localDriverApps: DriverApplication[] = [];
let localPickupPointApps: PickupPointApplication[] = [];

export function useListShopperApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<PersonalShopperApplication[]>({
    queryKey: ['shopperApplications'],
    queryFn: async () => [...localShopperApps],
    enabled: !!actor && !isFetching,
  });
}

export function useApproveShopperApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      localShopperApps = localShopperApps.map(app =>
        app.applicant.toString() === principal.toString()
          ? { ...app, status: { __kind__: 'approved' as const } }
          : app
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopperApplications'] });
    },
  });
}

export function useRejectShopperApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, reason }: { principal: Principal; reason: string }) => {
      localShopperApps = localShopperApps.map(app =>
        app.applicant.toString() === principal.toString()
          ? { ...app, status: { __kind__: 'rejected' as const, rejected: reason } }
          : app
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopperApplications'] });
    },
  });
}

export function useListDriverApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<DriverApplication[]>({
    queryKey: ['driverApplications'],
    queryFn: async () => [...localDriverApps],
    enabled: !!actor && !isFetching,
  });
}

export function useApproveDriverApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      localDriverApps = localDriverApps.map(app =>
        app.applicant.toString() === principal.toString()
          ? { ...app, status: { __kind__: 'approved' as const } }
          : app
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverApplications'] });
    },
  });
}

export function useRejectDriverApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, reason }: { principal: Principal; reason: string }) => {
      localDriverApps = localDriverApps.map(app =>
        app.applicant.toString() === principal.toString()
          ? { ...app, status: { __kind__: 'rejected' as const, rejected: reason } }
          : app
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverApplications'] });
    },
  });
}

export function useListPickupPointApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<PickupPointApplication[]>({
    queryKey: ['pickupPointApplications'],
    queryFn: async () => [...localPickupPointApps],
    enabled: !!actor && !isFetching,
  });
}

export function useApprovePickupPointApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      localPickupPointApps = localPickupPointApps.map(app =>
        app.applicant.toString() === principal.toString()
          ? { ...app, status: { __kind__: 'approved' as const } }
          : app
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupPointApplications'] });
    },
  });
}

export function useRejectPickupPointApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, reason }: { principal: Principal; reason: string }) => {
      localPickupPointApps = localPickupPointApps.map(app =>
        app.applicant.toString() === principal.toString()
          ? { ...app, status: { __kind__: 'rejected' as const, rejected: reason } }
          : app
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pickupPointApplications'] });
    },
  });
}

// Internal function to add applications (used by application submission hooks)
export function _addShopperApplication(app: PersonalShopperApplication) {
  localShopperApps = [...localShopperApps.filter(a => a.applicant.toString() !== app.applicant.toString()), app];
}

export function _addDriverApplication(app: DriverApplication) {
  localDriverApps = [...localDriverApps.filter(a => a.applicant.toString() !== app.applicant.toString()), app];
}

export function _addPickupPointApplication(app: PickupPointApplication) {
  localPickupPointApps = [...localPickupPointApps.filter(a => a.applicant.toString() !== app.applicant.toString()), app];
}
