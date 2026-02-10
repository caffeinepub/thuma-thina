import { useParams, useNavigate } from '@tanstack/react-router';
import { useProductCatalog, useAllProducts } from '../../hooks/useQueries';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Package, Loader2, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Retailer, Product, Listing } from '../../backend';
import { getPrimaryImage, getImageUrl } from '../../utils/productImages';
import { formatZAR } from '../../utils/money';
import { useMemo, useState } from 'react';

interface ExtendedCatalogItem {
  id: bigint;
  name: string;
  category: string;
  price: bigint;
  imageRef?: string;
  description?: string;
  product?: Product;
  listing: Listing;
}

export function RetailerCatalogPage() {
  const { retailerId } = useParams({ from: '/retailer/$retailerId' });
  const navigate = useNavigate();
  const { actor } = useActor();
  const { data: listings = [], isLoading: listingsLoading } = useProductCatalog(retailerId);
  const { data: allProducts = [] } = useAllProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Fetch retailer details
  const { data: retailer, isLoading: retailerLoading } = useQuery<Retailer | null>({
    queryKey: ['retailer', retailerId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRetailerById(BigInt(retailerId));
    },
    enabled: !!actor && !!retailerId
  });

  const catalogItems: ExtendedCatalogItem[] = useMemo(() => {
    return listings.map((listing) => {
      const product = allProducts.find((p) => p.id === listing.productId);
      const primaryImage = product ? getPrimaryImage(product) : null;
      
      return {
        id: listing.id,
        name: product?.name || 'Unknown Product',
        category: product?.category || 'Uncategorized',
        price: listing.price,
        imageRef: primaryImage ? getImageUrl(primaryImage) : undefined,
        description: product?.description || '',
        product,
        listing
      };
    });
  }, [listings, allProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...catalogItems];

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

    // Apply sorting
    if (sortMode === 'price-asc') {
      result.sort((a, b) => Number(a.price - b.price));
    } else if (sortMode === 'price-desc') {
      result.sort((a, b) => Number(b.price - a.price));
    }

    return result;
  }, [catalogItems, searchQuery, sortMode]);

  const handleProductClick = (productId: bigint) => {
    navigate({ 
      to: '/product/$productId', 
      params: { 
        productId: productId.toString() 
      } 
    });
  };

  if (listingsLoading || retailerLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="container-custom py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Retailer not found</p>
            <Button onClick={() => navigate({ to: '/' })} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{retailer.name}</h1>
            <p className="text-muted-foreground">
              {retailer.townSuburb}, {retailer.province}
            </p>
          </div>
          <Badge variant="secondary" className="self-start sm:self-center">
            {listings.length} {listings.length === 1 ? 'Product' : 'Products'}
          </Badge>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as any)}
          className="px-4 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No products match your search' : 'No products available at this retailer'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((item) => (
            <Card
              key={item.id.toString()}
              className="group cursor-pointer border-2 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-warm overflow-hidden"
              onClick={() => handleProductClick(item.listing.productId)}
            >
              <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
                {item.imageRef ? (
                  <img
                    src={item.imageRef}
                    alt={item.name}
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
                  style={{ display: item.imageRef ? 'none' : 'flex' }}
                >
                  <Package className="h-16 w-16 text-muted-foreground/40" />
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-base text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                  {item.category}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl font-bold text-primary">
                    {formatZAR(item.price)}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    Stock: {item.listing.stock.toString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
