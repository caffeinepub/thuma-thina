import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, ShoppingCart, Package, TrendingDown } from 'lucide-react';
import { useGlobalCatalogue } from '@/hooks/useCatalog';
import { useCart } from '@/components/shop/cart/CartProvider';
import { formatZAR } from '@/utils/money';
import { toast } from 'sonner';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';
import type { ShopProduct } from '@/backend';

export function CataloguePage() {
  const { data: products, isLoading } = useGlobalCatalogue();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products?.filter((product) => {
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    );
  });

  const handleAddToCart = (product: ShopProduct, listingId: bigint, activePrice: bigint, retailerName: string) => {
    addItem({
      listingId: listingId.toString(),
      productId: product.id.toString(),
      productName: product.name,
      retailerName,
      price: Number(activePrice),
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shop Catalogue</h1>
          <p className="text-muted-foreground">Browse products from local retailers</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading catalogue...</div>
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">
              {searchTerm ? 'No products match your search' : 'No products available'}
            </p>
            <p className="text-muted-foreground">Check back later for new items</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              // Filter out non-orderable listings (already done by backend, but defensive)
              const orderableListings = product.listings.filter((l) => l.stock > 0n);

              if (orderableListings.length === 0) {
                return null; // Skip products with no orderable listings
              }

              return (
                <Card key={Number(product.id)} className="flex flex-col">
                  <CardHeader>
                    {product.image && (
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                        <img
                          src={getExternalBlobUrl(product.image)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end space-y-3">
                    {orderableListings.map((listing) => (
                      <div
                        key={Number(listing.listingId)}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">{listing.retailerName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {listing.isPromoActive ? (
                              <>
                                <span className="text-lg font-bold text-primary">
                                  {formatZAR(listing.activePrice)}
                                </span>
                                <span className="text-sm line-through text-muted-foreground">
                                  {formatZAR(listing.normalPrice)}
                                </span>
                                {listing.savings && listing.savings > 0n && (
                                  <Badge variant="destructive" className="ml-1">
                                    <TrendingDown className="h-3 w-3 mr-1" />
                                    Save {formatZAR(listing.savings)}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-lg font-bold">{formatZAR(listing.activePrice)}</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Number(listing.stock)} in stock
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleAddToCart(product, listing.listingId, listing.activePrice, listing.retailerName)
                          }
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
