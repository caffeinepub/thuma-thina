import { useCataloguePreview } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Package, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Product } from '../../backend';
import { getPrimaryImage, getImageUrl } from '../../utils/productImages';

export function CataloguePreviewSection() {
  const { data: previewListings, isLoading } = useCataloguePreview();
  const { actor } = useActor();
  const navigate = useNavigate();

  // Fetch products for the preview listings
  const { data: products } = useQuery<Product[]>({
    queryKey: ['previewProducts', previewListings?.map(l => l.productId.toString()).join(',')],
    queryFn: async () => {
      if (!actor || !previewListings || previewListings.length === 0) return [];
      
      const productIds = new Set(previewListings.map(l => l.productId.toString()));
      const fetchedProducts: Product[] = [];
      
      for (const productId of productIds) {
        try {
          const productWithRetailers = await actor.getProductWithRetailers(BigInt(productId));
          fetchedProducts.push(productWithRetailers.product);
        } catch (e) {
          console.debug('Could not fetch product', productId);
        }
      }
      return fetchedProducts;
    },
    enabled: !!actor && !!previewListings && previewListings.length > 0
  });

  const formatPrice = (price: bigint) => {
    return `R ${Number(price).toFixed(2)}`;
  };

  const handleProductClick = (listing: any) => {
    navigate({ 
      to: '/product/$retailerId/$productId', 
      params: { 
        retailerId: listing.retailerId.toString(), 
        productId: listing.productId.toString() 
      } 
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container-custom">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!previewListings || previewListings.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what's available in your community
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
          {previewListings.map((listing) => {
            const product = products?.find(p => p.id === listing.productId);
            const primaryImage = product ? getPrimaryImage(product) : null;
            const imageUrlStr = primaryImage ? getImageUrl(primaryImage) : '';

            return (
              <button
                key={listing.id.toString()}
                onClick={() => handleProductClick(listing)}
                className="group flex flex-col rounded-2xl border-2 border-border bg-card hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-warm overflow-hidden text-left"
              >
                <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
                  {imageUrlStr ? (
                    <img
                      src={imageUrlStr}
                      alt={product?.name || 'Product'}
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
                    style={{ display: imageUrlStr ? 'none' : 'flex' }}
                  >
                    <Package className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {product?.name || 'Loading...'}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                      {product?.category || 'Uncategorized'}
                    </p>
                  </div>
                  <p className="font-display text-xl font-bold text-primary">
                    {formatPrice(listing.price)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate({ to: '/' })}
            size="lg"
            className="rounded-full px-8 shadow-warm"
          >
            Browse All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
