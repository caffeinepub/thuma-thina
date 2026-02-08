import { useProductWithRetailers } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, Loader2, Package, Tag, Store } from 'lucide-react';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import { Button } from '@/components/ui/button';

export function ProductDetailPage() {
  const { retailerId, productId } = useParams({ strict: false });
  const { data: productWithRetailers, isLoading } = useProductWithRetailers(productId || '');
  const navigate = useNavigate();

  const formatPrice = (price: bigint) => {
    return `R ${Number(price).toFixed(2)}`;
  };

  // Helper to normalize image URLs
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

  if (isLoading) {
    return (
      <div className="container-custom py-8 sm:py-12">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!productWithRetailers) {
    return (
      <div className="container-custom py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate({ 
              to: '/retailer/$retailerId', 
              params: { retailerId: retailerId || '' } 
            })}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Catalog
          </button>
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  const { product, listings } = productWithRetailers;

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate({ 
            to: '/retailer/$retailerId', 
            params: { retailerId: retailerId || '' } 
          })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Catalog
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="rounded-3xl border-2 border-border bg-card overflow-hidden shadow-warm ring-1 ring-border/30">
            <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/50 relative">
              {product.imageRef ? (
                <img
                  src={getImageUrl(product.imageRef)}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                <Package className="h-32 w-32 text-muted-foreground/30" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary-foreground text-sm font-semibold mb-4 border border-secondary/30">
                <Tag className="h-4 w-4 mr-2" />
                {product.category}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="border-t-2 border-border pt-6">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                Description
              </h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-base">
                {product.description || 'No description available.'}
              </p>
            </div>

            {/* Retailer Offers */}
            {listings.length > 0 && (
              <div className="border-t-2 border-border pt-6">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Available From
                </h2>
                <div className="space-y-3">
                  {listings.map(([retailer, listing]) => (
                    <button
                      key={listing.id.toString()}
                      onClick={() => navigate({ 
                        to: '/retailer/$retailerId', 
                        params: { retailerId: retailer.id.toString() } 
                      })}
                      className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 text-accent">
                          <Store className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{retailer.name}</p>
                          <p className="text-xs text-muted-foreground">{retailer.townSuburb}</p>
                        </div>
                      </div>
                      <p className="font-display text-xl font-bold text-primary">
                        {formatPrice(listing.price)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t-2 border-border pt-6 mt-auto">
              <div className="rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-6 border-2 border-dashed border-border">
                <p className="text-sm text-muted-foreground text-center font-medium">
                  🛒 Order placement coming soon! Currently browsing only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
