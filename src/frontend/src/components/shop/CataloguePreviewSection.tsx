import { useCataloguePreview } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Package, Loader2, ArrowRight } from 'lucide-react';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Product } from '../../backend';

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

  const getImageUrl = (imageRef: string) => {
    if (!imageRef) return '';
    if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) {
      return imageRef;
    }
    if (imageRef.startsWith('/assets/') || imageRef.startsWith('assets/')) {
      return publicAssetUrl(imageRef);
    }
    return imageRef;
  };

  const handleProductClick = (listing: any) => {
    navigate({ 
      to: '/retailer/$retailerId', 
      params: { retailerId: listing.retailerId.toString() } 
    });
  };

  if (isLoading) {
    return (
      <section className="py-12 border-t-2 border-border">
        <div className="container-custom">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (!previewListings || previewListings.length === 0) {
    return null;
  }

  return (
    <section className="py-12 border-t-2 border-border">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Catalogue
              </h2>
              <p className="text-muted-foreground">
                Browse our selection of products from local retailers
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {previewListings.slice(0, 8).map((listing) => {
              const product = products?.find(p => p.id === listing.productId);
              
              return (
                <Card
                  key={listing.id.toString()}
                  className="group cursor-pointer border-2 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-warm overflow-hidden"
                  onClick={() => handleProductClick(listing)}
                >
                  <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
                    {product?.imageRef ? (
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
                      style={{ display: product?.imageRef ? 'none' : 'flex' }}
                    >
                      <Package className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                      {product?.name || 'Product'}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                      {product?.category || 'Category'}
                    </p>
                    <p className="font-display text-lg font-bold text-primary">
                      {formatPrice(listing.price)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate({ to: '/' })}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              Browse All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
