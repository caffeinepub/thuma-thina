import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Edit, Package, Info } from 'lucide-react';
import { useListProducts } from '@/hooks/useProducts';
import { ProductEditDialog } from '@/components/admin/ProductEditDialog';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';
import { navigate } from '@/router/HashRouter';
import type { Product } from '@/backend';

export function AdminProductsPage() {
  const { data: products, isLoading } = useListProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage the global product catalogue</p>
          </div>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Products added here form the global catalogue. They become visible to customers once you create at
            least one listing linking the product to a retailer with a price.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>{products?.length || 0} products in catalogue</CardDescription>
              </div>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                <div className="text-center py-8 text-muted-foreground">Loading products...</div>
              ) : !filteredProducts || filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No products match your search' : 'No products yet'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateNew}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => {
                      const imageUrl = product.preferredImage
                        ? getExternalBlobUrl(product.preferredImage)
                        : product.imageRefs.length > 0
                        ? getExternalBlobUrl(product.imageRefs[0])
                        : '';

                      return (
                        <TableRow key={Number(product.id)}>
                          <TableCell>
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <ProductEditDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} product={selectedProduct} />
      </div>
    </div>
  );
}
