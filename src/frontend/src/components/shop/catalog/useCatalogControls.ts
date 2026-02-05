import { useState, useMemo } from 'react';
import type { Product } from '../../../backend';

export function useCatalogControls(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortMode, setSortMode] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category));
    return Array.from(uniqueCategories).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Apply sorting
    if (sortMode === 'price-asc') {
      result.sort((a, b) => Number(a.price - b.price));
    } else if (sortMode === 'price-desc') {
      result.sort((a, b) => Number(b.price - a.price));
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortMode]);

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
