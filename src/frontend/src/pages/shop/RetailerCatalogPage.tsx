import { useProductCatalog } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, Loader2, Package, Search } from 'lucide-react';
import { useCatalogControls } from '../../components/shop/catalog/useCatalogControls';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Product } from '../../backend';

export function RetailerCatalogPage() {
  const { retailerId } = useParams({ strict: false });
  const { data: listings, isLoading, error } = useProductCatalog(retailerId || '');
  const { actor } = useActor();
  const navigate = useNavigate();

  // Fetch all products to enrich listings
  const { data: allProducts } = useQuery<Product[]>({
    queryKey: ['allProducts'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const allListings = await actor.getAllActiveListings();
        const productIds = new Set(allListings.map(l => l.productId.toString()));
        const products: Product[] = [];
        
        for (const productId of productIds) {
          try {
            const productWithRetailers = await actor.getProductWithRetailers(BigInt(productId));
            products.push(productWithRetailers.product);
          } catch (e) {
            console.debug('Could not fetch product', productId);
          }
        }
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },
    enabled: !!actor
  });

  // Enrich listings with product data for catalog controls
  const enrichedProducts = (listings || []).map(listing => {
    const product = allProducts?.find(p => p.id === listing.productId);
    return {
      id: listing.productId,
      name: product?.name || 'Unknown Product',
      category: product?.category || 'Uncategorized',
      description: product?.description || '',
      imageRef: product?.imageRef || '',
      price: listing.price
    };
  });

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortMode,
    setSortMode,
    filteredProducts,
    categories
  } = useCatalogControls(enrichedProducts);

  const handleProductClick = (productId: bigint) => {
    navigate({ 
      to: '/product/$retailerId/$productId', 
      params: { 
        retailerId: retailerId || '', 
        productId: productId.toString() 
      } 
    });
  };

  const formatPrice = (price: bigint) => {
    return `R ${Number(price).toFixed(2)}`;
  };

  // Helper to normalize image URLs
  const getImageUrl = (imageRef: string) => {
    if (!imageRef) return '';
    // If it's already a full URL, return as-is
    if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) {
      return imageRef;
    }
    // If it looks like a public asset path, normalize it
    if (imageRef.startsWith('/assets/') || imageRef.startsWith('assets/')) {
      return publicAssetUrl(imageRef);
    }
    return imageRef;
  };

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
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
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm font-medium"
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
              className="px-4 py-3 rounded-xl border-2 border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm font-medium"
            >
              <option value="default">Sort by</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border-2 border-destructive/50 bg-destructive/5 p-6 text-destructive shadow-sm">
            <p className="font-semibold text-lg">Error loading products</p>
            <p className="text-sm mt-1 opacity-90">Please try again later</p>
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg mb-4">
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
                className="text-sm text-primary hover:text-primary/80 font-medium underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id.toString()}
                onClick={() => handleProductClick(product.id)}
                className="group flex flex-col rounded-2xl border-2 border-border bg-card hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-warm overflow-hidden text-left"
              >
                <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
                  {product.imageRef ? (
                    <img
                      src={getImageUrl(product.imageRef)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/70"
                    style={{ display: product.imageRef ? 'none' : 'flex' }}
                  >
                    <Package className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                      {product.category}
                    </p>
                  </div>
                  <p className="font-display text-xl font-bold text-primary">
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
