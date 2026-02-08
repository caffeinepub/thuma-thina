import { useState, useMemo } from 'react';

interface CatalogItem {
  id: bigint;
  name: string;
  category: string;
  price: bigint;
  imageRef?: string;
  description?: string;
}

export function useCatalogControls(items: CatalogItem[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortMode, setSortMode] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map(item => item.category));
    return Array.from(uniqueCategories).sort();
  }, [items]);

  const filteredProducts = useMemo(() => {
    let result = [...items];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    // Apply sorting
    if (sortMode === 'price-asc') {
      result.sort((a, b) => Number(a.price - b.price));
    } else if (sortMode === 'price-desc') {
      result.sort((a, b) => Number(b.price - a.price));
    }

    return result;
  }, [items, searchQuery, selectedCategory, sortMode]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortMode,
    setSortMode,
    filteredProducts,
    categories
  };
}
