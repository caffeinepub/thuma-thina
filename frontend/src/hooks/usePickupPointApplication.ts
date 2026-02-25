import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { _addPickupPointApplication, type PickupPointApplication } from './useRoleApplications';

export interface PickupPointApplicationInput {
  name: string;
  address: string;
  contactNumber: string;
  businessImageUrl: string;
  townId?: bigint;
}

let myPickupPointApplications: Map<string, PickupPointApplication> = new Map();

export function useMyPickupPointApplication() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<PickupPointApplication | null>({
    queryKey: ['myPickupPointApplication', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      const key = identity.getPrincipal().toString();
      return myPickupPointApplications.get(key) ?? null;
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitPickupPointApplication() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PickupPointApplicationInput) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');

      const principal = identity.getPrincipal();
      const now = BigInt(Date.now()) * BigInt(1_000_000);

      const app: PickupPointApplication = {
        applicant: principal,
        name: input.name,
        address: input.address,
        contactNumber: input.contactNumber,
        businessImage: { url: input.businessImageUrl },
        townId: input.townId,
        status: { __kind__: 'pending' },
        submittedAt: now,
      };

      myPickupPointApplications.set(principal.toString(), app);
      _addPickupPointApplication(app);
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myPickupPointApplication'] });
      queryClient.invalidateQueries({ queryKey: ['pickupPointApplications'] });
    },
  });
}
