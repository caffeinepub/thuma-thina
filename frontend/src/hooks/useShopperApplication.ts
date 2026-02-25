import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { _addShopperApplication, type PersonalShopperApplication } from './useRoleApplications';

export interface ShopperApplicationInput {
  name: string;
  email: string;
  phone: string;
  selfieImageUrl: string;
}

// Local store keyed by principal string
const myShopperApplications = new Map<string, PersonalShopperApplication>();

export function useMyShopperApplication() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PersonalShopperApplication | null>({
    queryKey: ['myShopperApplication', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      const key = identity.getPrincipal().toString();
      return myShopperApplications.get(key) ?? null;
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitShopperApplication() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ShopperApplicationInput) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');

      const principal = identity.getPrincipal();
      const now = BigInt(Date.now()) * BigInt(1_000_000);

      const app: PersonalShopperApplication = {
        applicant: principal,
        name: input.name,
        email: input.email,
        phone: input.phone,
        selfieImage: { url: input.selfieImageUrl },
        status: { __kind__: 'pending' },
        submittedAt: now,
      };

      myShopperApplications.set(principal.toString(), app);
      _addShopperApplication(app);
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myShopperApplication'] });
      queryClient.invalidateQueries({ queryKey: ['shopperApplications'] });
    },
  });
}
