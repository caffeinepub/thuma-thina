import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ExternalBlob } from '@/backend';
import type { PersonalShopperApplication, PersonalShopperStatus } from '@/backend';
import { roleApplicationKeys } from './useRoleApplications';

export function useGetMyShopperApplication() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<PersonalShopperApplication | null>({
    queryKey: roleApplicationKeys.myShopperApplication,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPersonalShopperApplication();
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

export function useGetMyShopperStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PersonalShopperStatus | null>({
    queryKey: ['myShopperStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPersonalShopperStatus();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSubmitShopperApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      selfieImage,
    }: {
      name: string;
      email: string;
      phone: string;
      selfieImage: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPersonalShopperApplication(name, email, phone, selfieImage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleApplicationKeys.myShopperApplication });
      queryClient.invalidateQueries({ queryKey: ['myShopperStatus'] });
    },
  });
}
