import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import type { DriverApplication } from '@/backend';

export const driverApplicationKeys = {
  myApplication: ['myDriverApplication'],
  myStatus: ['myDriverStatus'],
};

export function useGetMyDriverApplication() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DriverApplication | null>({
    queryKey: driverApplicationKeys.myApplication,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDriverApplication();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyDriverStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ __kind__: 'pending' } | { __kind__: 'approved' } | { __kind__: 'rejected'; rejected: string } | null>({
    queryKey: driverApplicationKeys.myStatus,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const app = await actor.getDriverApplication();
      return app ? app.status : null;
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitDriverApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      vehicleDetails,
      selfieBytes,
    }: {
      name: string;
      email: string;
      phone: string;
      vehicleDetails: string;
      selfieBytes: Uint8Array;
    }) => {
      if (!actor) throw new Error('Actor not available');

      const selfieBlob = ExternalBlob.fromBytes(new Uint8Array(selfieBytes));
      const kycDocs = [selfieBlob];

      return actor.createDriverApplication(name, email, phone, vehicleDetails, kycDocs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverApplicationKeys.myApplication });
      queryClient.invalidateQueries({ queryKey: driverApplicationKeys.myStatus });
    },
  });
}
