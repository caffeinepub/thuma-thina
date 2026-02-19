import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob, TownId } from '@/backend';
import type { PickupPointApplication } from '@/backend';

export const pickupPointApplicationKeys = {
  myApplication: ['myPickupPointApplication'],
  myStatus: ['myPickupPointStatus'],
  pendingApplications: ['pendingPickupPointApplications'],
};

export function useGetMyPickupPointApplication() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PickupPointApplication | null>({
    queryKey: pickupPointApplicationKeys.myApplication,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPickupPointApplication();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetMyPickupPointStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ __kind__: 'pending' } | { __kind__: 'approved' } | { __kind__: 'rejected'; rejected: string } | null>({
    queryKey: pickupPointApplicationKeys.myStatus,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPickupPointStatus();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSubmitPickupPointApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      address,
      contactNumber,
      businessImage,
      townId,
    }: {
      name: string;
      address: string;
      contactNumber: string;
      businessImage: ExternalBlob;
      townId: TownId;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPickupPointApplication(name, address, contactNumber, businessImage, townId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupPointApplicationKeys.myApplication });
      queryClient.invalidateQueries({ queryKey: pickupPointApplicationKeys.myStatus });
    },
  });
}
