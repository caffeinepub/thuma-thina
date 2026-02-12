import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import type { PersonalShopperApplication, PickupPointApplication, DriverApplication } from '@/backend';

export const roleApplicationKeys = {
  myShopperApplication: ['myShopperApplication'],
  pendingShoppers: ['pendingShoppers'],
  allShoppers: ['allShoppers'],
  pendingDrivers: ['pendingDrivers'],
  allDrivers: ['allDrivers'],
  pendingPickupPoints: ['pendingPickupPoints'],
  allPickupPoints: ['allPickupPoints'],
};

// Shopper Applications
export function useShopperApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PersonalShopperApplication[]>({
    queryKey: roleApplicationKeys.allShoppers,
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
      return actor.approvePersonalShopper(applicant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.allShoppers });
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.pendingShoppers });
    },
  });
}

export function useRejectShopper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicant, reason }: { applicant: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectPersonalShopper(applicant, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.allShoppers });
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.pendingShoppers });
    },
  });
}

// Pickup Point Applications
export function usePickupPointApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PickupPointApplication[]>({
    queryKey: roleApplicationKeys.allPickupPoints,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listPendingPickupPointApplications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApprovePickupPoint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approvePickupPoint(applicant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.allPickupPoints });
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.pendingPickupPoints });
    },
  });
}

export function useRejectPickupPoint() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicant, reason }: { applicant: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectPickupPoint(applicant, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.allPickupPoints });
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.pendingPickupPoints });
    },
  });
}

// Driver Applications
export function useDriverApplications() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DriverApplication[]>({
    queryKey: roleApplicationKeys.allDrivers,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listPendingDriverApplications();
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
      return actor.approveDriver(applicant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.allDrivers });
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.pendingDrivers });
    },
  });
}

export function useRejectDriver() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicant, reason }: { applicant: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectDriver(applicant, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.allDrivers });
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.pendingDrivers });
    },
  });
}
