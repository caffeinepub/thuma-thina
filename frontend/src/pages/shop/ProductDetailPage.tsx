import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { navigate } from '@/router/HashRouter';

interface ProductDetailPageProps {
  productId: string;
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const id = BigInt(productId);
  const { data: product, isLoading } = useProduct(id);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-80 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Product Not Found</h2>
        <p className="text-muted-foreground mt-2">
          This product doesn't exist or has been removed.
        </p>
        <Button className="mt-4" onClick={() => navigate('/catalogue')}>
          Back to Catalogue
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/catalogue')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Catalogue
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {product.preferredImage?.url ? (
            <img
              src={product.preferredImage.url}
              alt={product.name}
              className="w-full h-80 object-cover rounded-lg border"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          {product.imageRefs.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.imageRefs.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`${product.name} ${i + 1}`}
                  className="w-16 h-16 object-cover rounded border flex-shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Badge variant="secondary" className="mt-2">
              {product.category}
            </Badge>
          </div>

          {product.description && (
            <p className="text-muted-foreground">{product.description}</p>
          )}

          <Button
            className="w-full"
            onClick={() => navigate('/catalogue')}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Find at a Retailer
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
