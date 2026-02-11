import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Frequent categories provided by the user
export const FREQUENT_CATEGORIES = [
  'Groceries & Food',
  'Fresh Produce',
  'Dairy & Eggs',
  'Meat, Poultry & Fish',
  'Bakery & Bread',
  'Pantry Staples',
  'Snacks & Confectionery',
  'Beverages',
  'Household & Cleaning',
  'Cleaning Supplies',
  'Toiletries & Personal Care',
  'Laundry Products',
  'Paper Products',
  'Kitchenware & Disposables',
  'Health & Pharmacy',
  'Over-the-Counter Medicines & Pain Relief',
  'Vitamins & Supplements',
  'First Aid & Medical Supplies',
  'Baby Care',
  'Feminine Hygiene',
  'Beauty & Personal Care',
  'Skincare & Cosmetics',
  'Hair Care',
  'Fragrances & Deodorants',
  'Bath & Body',
  'Baby & Kids',
  'Baby Food & Formula',
  'Diapers & Wipes',
  'Baby Clothing & Accessories',
  'Toys & Books',
  'Pet Supplies',
  'Pet Food',
  'Pet Treats & Accessories',
  'Litter & Grooming',
  'Alcohol & Tobacco',
  'Beer & Cider',
  'Wine & Spirits',
  'Tobacco Products',
  'Electronics & Accessories',
  'Mobile Phone Accessories',
  'Small Appliances',
  'Batteries & Cables',
  'Hardware & DIY',
  'Tools & Fasteners',
  'Paint & Adhesives',
  'Plumbing & Electrical Basics',
  'Gardening Supplies',
  'Stationery & Office',
  'Pens, Notebooks & Paper',
  'Printer Ink & Paper',
  'School Supplies',
  'Frozen & Ready Meals',
  'Frozen Vegetables & Meals',
  'Ice Cream & Desserts',
  'Ready-to-Eat Meals',
  'Clothing & Footwear',
  'Underwear & Socks',
  'Basic T-shirts & Loungewear',
  'Shoes & Slippers',
  'Home & Kitchen Appliances',
  'Cookware & Utensils',
  'Storage & Organisation',
  'Other / Miscellaneous',
  'Gift Items & Cards',
  'Seasonal / Festive Products',
];

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

export function useListCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const backendCategories = await actor.listCategories();
      
      // Merge frequent categories with backend categories, removing duplicates
      const allCategories = new Set([...FREQUENT_CATEGORIES, ...backendCategories]);
      return Array.from(allCategories).sort();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
