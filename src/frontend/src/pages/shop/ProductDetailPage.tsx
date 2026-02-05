import { useProductCatalog } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, Loader2, Package, Tag } from 'lucide-react';

export function ProductDetailPage() {
  const { retailerId, productId } = useParams({ strict: false });
  const { data: products, isLoading } = useProductCatalog(retailerId || '');
  const navigate = useNavigate();

  const product = products?.find(p => p.id.toString() === productId);

  const formatPrice = (price: bigint) => {
    return `R ${Number(price).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8 sm:py-12">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate({ 
              to: '/retailer/$retailerId', 
              params: { retailerId: retailerId || '' } 
            })}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Catalog
          </button>
          <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">Product not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate({ 
            to: '/retailer/$retailerId', 
            params: { retailerId: retailerId || '' } 
          })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Catalog
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-warm">
            <div className="aspect-square bg-muted/50 relative">
              {product.imageRef ? (
                <img
                  src={product.imageRef}
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
                className="absolute inset-0 flex items-center justify-center"
                style={{ display: product.imageRef ? 'none' : 'flex' }}
              >
                <Package className="h-24 w-24 text-muted-foreground/30" />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-6">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-medium mb-4">
                <Tag className="h-3.5 w-3.5 mr-1.5" />
                {product.category}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="font-display text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                Description
              </h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {product.description || 'No description available.'}
              </p>
            </div>

            <div className="border-t border-border pt-6 mt-auto">
              <div className="rounded-lg bg-muted/50 p-4 border border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Order placement coming soon! Currently browsing only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
