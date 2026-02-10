import { useCataloguePreview } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Package, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { Product } from '../../backend';
import { getPrimaryImage, getImageUrl } from '../../utils/productImages';
import { formatZAR } from '../../utils/money';

export function CataloguePreviewSection() {
  const { data: previewListings, isLoading } = useCataloguePreview();
  const { actor } = useActor();
  const navigate = useNavigate();

  // Fetch products for preview listings
  const { data: previewProducts } = useQuery<Product[]>({
    queryKey: ['previewProducts'],
    queryFn: async () => {
      if (!actor || !previewListings) return [];
      try {
        const productIds = new Set(previewListings.map(l => l.productId.toString()));
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
        console.error('Error fetching preview products:', error);
        return [];
      }
    },
    enabled: !!actor && !!previewListings && previewListings.length > 0
  });

  const handleProductClick = (productId: bigint) => {
    navigate({ 
      to: '/product/$productId', 
      params: { 
        productId: productId.toString() 
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
            Browse our selection of quality products from local retailers
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {previewListings.map((listing) => {
            const product = previewProducts?.find(p => p.id === listing.productId);
            const primaryImage = product ? getPrimaryImage(product) : null;
            
            return (
              <Card
                key={listing.id.toString()}
                className="group cursor-pointer border-2 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-warm overflow-hidden"
                onClick={() => handleProductClick(listing.productId)}
              >
                <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/50 relative overflow-hidden">
                  {primaryImage ? (
                    <img
                      src={getImageUrl(primaryImage)}
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
                    style={{ display: primaryImage ? 'none' : 'flex' }}
                  >
                    <Package className="h-16 w-16 text-muted-foreground/40" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-base text-foreground mb-1.5 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {product?.name || 'Product'}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                    {product?.category || 'Category'}
                  </p>
                  <p className="font-display text-xl font-bold text-primary">
                    {formatZAR(listing.price)}
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
            className="group"
          >
            Browse All Products
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
