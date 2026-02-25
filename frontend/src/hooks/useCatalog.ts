import { useQuery } from '@tanstack/react-query';

// Stub hook - backend no longer supports catalogue
export function useGetCatalogue() {
  return useQuery({
    queryKey: ['catalogue'],
    queryFn: async () => [],
    staleTime: Infinity,
  });
}
