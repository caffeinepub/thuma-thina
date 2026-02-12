import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DriverApplication, ExternalBlob } from '@/backend';

export const driverApplicationKeys = {
  myDriverApplication: ['myDriverApplication'],
};

export function useGetDriverApplication() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<DriverApplication | null>({
    queryKey: driverApplicationKeys.myDriverApplication,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDriverApplication();
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

export function useSubmitDriverApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      vehicleDetails: string;
      selfieImage: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createDriverApplication(
        data.name,
        data.email,
        data.phone,
        data.vehicleDetails,
        [data.selfieImage]
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driverApplicationKeys.myDriverApplication });
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
}
