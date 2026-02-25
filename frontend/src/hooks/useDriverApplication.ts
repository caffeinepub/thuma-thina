import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { _addDriverApplication, type DriverApplication } from './useRoleApplications';

export interface DriverApplicationInput {
  name: string;
  email: string;
  phone: string;
  vehicleDetails: string;
  selfieImageUrl: string;
}

let myDriverApplications: Map<string, DriverApplication> = new Map();

export function useMyDriverApplication() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<DriverApplication | null>({
    queryKey: ['myDriverApplication', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!identity) return null;
      const key = identity.getPrincipal().toString();
      return myDriverApplications.get(key) ?? null;
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useSubmitDriverApplication() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DriverApplicationInput) => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Not authenticated');

      const principal = identity.getPrincipal();
      const now = BigInt(Date.now()) * BigInt(1_000_000);

      const app: DriverApplication = {
        applicant: principal,
        name: input.name,
        email: input.email,
        phone: input.phone,
        vehicleDetails: input.vehicleDetails,
        kycDocs: input.selfieImageUrl ? [{ url: input.selfieImageUrl }] : [],
        status: { __kind__: 'pending' },
        submittedAt: now,
      };

      myDriverApplications.set(principal.toString(), app);
      _addDriverApplication(app);
      return app;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDriverApplication'] });
      queryClient.invalidateQueries({ queryKey: ['driverApplications'] });
    },
  });
}
