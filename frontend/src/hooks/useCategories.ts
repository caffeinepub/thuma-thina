import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

const FREQUENT_CATEGORIES = [
  'Fresh Produce',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Bakery',
  'Beverages',
  'Snacks & Confectionery',
  'Household & Cleaning',
  'Personal Care',
  'Baby & Toddler',
  'Frozen Foods',
  'Canned & Packaged',
  'Condiments & Sauces',
];

let localCategories: string[] = [...FREQUENT_CATEGORIES];

export function useCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      return [...new Set(localCategories)];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!localCategories.includes(name)) {
        localCategories = [...localCategories, name];
      }
      return name;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}
