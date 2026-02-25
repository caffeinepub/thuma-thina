import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Search, ShoppingCart, Store } from 'lucide-react';
import { useRetailer } from '@/hooks/useRetailers';
import { useListings } from '@/hooks/useListings';
import { useProducts } from '@/hooks/useProducts';
import { navigate } from '@/router/HashRouter';

interface RetailerCatalogPageProps {
  retailerId: string;
}

function formatPrice(price: bigint): string {
  return `R ${(Number(price) / 100).toFixed(2)}`;
}

export function RetailerCatalogPage({ retailerId }: RetailerCatalogPageProps) {
  const id = BigInt(retailerId);
  const { data: retailer, isLoading: retailerLoading } = useRetailer(id);
  const { data: allListings = [], isLoading: listingsLoading } = useListings();
  const { data: products = [] } = useProducts();

  const [search, setSearch] = useState('');

  const retailerListings = allListings.filter(l => l.retailerId === id);

  const enrichedListings = retailerListings
    .map(listing => {
      const product = products.find(p => p.id === listing.productId);
      return { listing, product };
    })
    .filter(({ product }) => {
      if (!product) return false;
      const q = search.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    });

  const isLoading = retailerLoading || listingsLoading;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!retailer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Retailer Not Found</h2>
        <p className="text-muted-foreground mt-2">
          This retailer doesn't exist or has been removed.
        </p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div className="rounded-lg border bg-card p-4">
        <h1 className="text-2xl font-bold">{retailer.name}</h1>
        <p className="text-muted-foreground">
          {retailer.address || retailer.townSuburb}, {retailer.province}
        </p>
        {retailer.phone && (
          <p className="text-sm text-muted-foreground mt-1">{retailer.phone}</p>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {enrichedListings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>
            {search
              ? 'No products match your search.'
              : 'No products listed at this retailer yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {enrichedListings.map(({ listing, product }) => (
            <div
              key={listing.id.toString()}
              className="rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
              onClick={() => navigate(`/product/${product!.id}`)}
            >
              {product!.preferredImage?.url ? (
                <img
                  src={product!.preferredImage.url}
                  alt={product!.name}
                  className="w-full h-36 object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-36 bg-muted flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-3 space-y-1">
                <h3 className="font-semibold text-sm line-clamp-2">{product!.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {product!.category}
                </Badge>
                <p className="font-bold text-primary">{formatPrice(listing.price)}</p>
                <Badge
                  variant={listing.status.__kind__ === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {listing.status.__kind__ === 'active'
                    ? `${listing.stock} in stock`
                    : listing.status.__kind__}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RetailerCatalogPage;
