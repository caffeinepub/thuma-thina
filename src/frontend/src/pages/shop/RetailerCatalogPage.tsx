import { useProductCatalog } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, Loader2, Package, Search } from 'lucide-react';
import { useCatalogControls } from '../../components/shop/catalog/useCatalogControls';
import type { Product } from '../../backend';

export function RetailerCatalogPage() {
  const { retailerId } = useParams({ strict: false });
  const { data: products, isLoading, error } = useProductCatalog(retailerId || '');
  const navigate = useNavigate();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortMode,
    setSortMode,
    filteredProducts,
    categories
  } = useCatalogControls(products || []);

  const handleProductClick = (product: Product) => {
    navigate({ 
      to: '/product/$retailerId/$productId', 
      params: { 
        retailerId: retailerId || '', 
        productId: product.id.toString() 
      } 
    });
  };

  const formatPrice = (price: bigint) => {
    return `R ${Number(price).toFixed(2)}`;
  };

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Retailers
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Product Catalog
          </h2>

          {/* Search and Filters */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as 'default' | 'price-asc' | 'price-desc')}
              className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Error loading products</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== '' 
                ? 'No products match your search' 
                : 'No products available yet'}
            </p>
            {(searchQuery || selectedCategory !== '') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id.toString()}
                onClick={() => handleProductClick(product)}
                className="group flex flex-col rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-200 shadow-xs hover:shadow-warm overflow-hidden text-left"
              >
                <div className="aspect-square bg-muted/50 relative overflow-hidden">
                  {product.imageRef ? (
                    <img
                      src={product.imageRef}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ display: product.imageRef ? 'none' : 'flex' }}
                  >
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {product.category}
                    </p>
                  </div>
                  <p className="font-display text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
