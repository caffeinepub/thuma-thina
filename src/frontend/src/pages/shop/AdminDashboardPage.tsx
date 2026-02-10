import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, Trash2, Pencil, Loader2, Package, Store, List, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { ProductEditDialog } from '@/components/admin/ProductEditDialog';
import { DangerZoneWipeSystemCard } from '@/components/admin/DangerZoneWipeSystemCard';
import {
  useDashboardData,
  useAddProduct,
  useAddListing,
  useAllProducts,
  useAllRetailers,
  useRemoveProduct
} from '@/hooks/useQueries';
import { formatZAR, parseZAR } from '@/utils/money';
import { ListingStatus } from '@/backend';
import type { Product, ProductId } from '@/backend';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardData();
  const { data: allProducts = [], isLoading: productsLoading } = useAllProducts();
  const { data: allRetailers = [], isLoading: retailersLoading } = useAllRetailers();

  const addProductMutation = useAddProduct();
  const addListingMutation = useAddListing();
  const removeProductMutation = useRemoveProduct();

  // Product form state
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState<File | undefined>();

  // Listing form state
  const [listingRetailerId, setListingRetailerId] = useState('');
  const [listingProductId, setListingProductId] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingStock, setListingStock] = useState('');
  const [listingStatus, setListingStatus] = useState<string>('active');

  // Edit/Delete state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync({
        name: productName,
        category: productCategory,
        description: productDescription,
        preferredImage: productImage
      });
      toast.success('Product added successfully');
      // Reset form
      setProductName('');
      setProductCategory('');
      setProductDescription('');
      setProductImage(undefined);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product');
    }
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const priceValue = parseZAR(listingPrice);
      const stockValue = BigInt(listingStock);

      await addListingMutation.mutateAsync({
        retailerId: BigInt(listingRetailerId),
        productId: BigInt(listingProductId),
        price: priceValue,
        stock: stockValue,
        status: listingStatus as ListingStatus
      });
      toast.success('Listing added successfully');
      // Reset form
      setListingRetailerId('');
      setListingProductId('');
      setListingPrice('');
      setListingStock('');
      setListingStatus('active');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add listing');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await removeProductMutation.mutateAsync(deletingProduct.id);
      toast.success('Product deleted successfully');
      setDeletingProduct(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const isLoading = dashboardLoading || productsLoading || retailersLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your platform's products, retailers, and listings</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retailers</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.retailers.toString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.products.toString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listings</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.listings.toString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.requests.toString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key management pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate({ to: '/admin/retailers' })}
            >
              <Store className="mr-2 h-4 w-4" />
              Manage Retailers
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate({ to: '/admin/listings' })}
            >
              <List className="mr-2 h-4 w-4" />
              Manage Listings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Product Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Create a new product in the universal catalogue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Fresh Tomatoes"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Category</Label>
                <Input
                  id="product-category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  placeholder="e.g., Vegetables"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Product description..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="product-image">Product Image (Optional)</Label>
              <Input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={(e) => setProductImage(e.target.files?.[0])}
              />
            </div>
            <Button type="submit" disabled={addProductMutation.isPending}>
              {addProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Add Listing Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Listing</CardTitle>
          <CardDescription>Create a listing for a product at a retailer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddListing} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="listing-retailer">Retailer</Label>
                <SearchableSelect
                  options={allRetailers.map((r) => ({
                    value: r.id.toString(),
                    label: `${r.name} (${r.townSuburb})`,
                    searchText: `${r.name} ${r.townSuburb} ${r.province}`
                  }))}
                  value={listingRetailerId}
                  onValueChange={setListingRetailerId}
                  placeholder="Select retailer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listing-product">Product</Label>
                <SearchableSelect
                  options={allProducts.map((p) => ({
                    value: p.id.toString(),
                    label: p.name,
                    searchText: `${p.name} ${p.category}`
                  }))}
                  value={listingProductId}
                  onValueChange={setListingProductId}
                  placeholder="Select product"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="listing-price">Price (ZAR)</Label>
                <Input
                  id="listing-price"
                  type="text"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  placeholder="e.g., 25.99"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listing-stock">Stock</Label>
                <Input
                  id="listing-stock"
                  type="number"
                  min="0"
                  value={listingStock}
                  onChange={(e) => setListingStock(e.target.value)}
                  placeholder="e.g., 100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="listing-status">Status</Label>
                <SearchableSelect
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'outOfStock', label: 'Out of Stock' },
                    { value: 'discontinued', label: 'Discontinued' }
                  ]}
                  value={listingStatus}
                  onValueChange={setListingStatus}
                  placeholder="Select status"
                />
              </div>
            </div>
            <Button type="submit" disabled={addListingMutation.isPending || !listingRetailerId || !listingProductId}>
              {addListingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="mr-2 h-4 w-4" />
              Add Listing
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Universal Products Catalogue */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Universal Products Catalogue</CardTitle>
          <CardDescription>All products available in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : allProducts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No products yet. Add your first product above.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProducts.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{product.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                          title="Edit product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingProduct(product)}
                          title="Delete product"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <DangerZoneWipeSystemCard />

      {/* Edit Product Dialog */}
      {editingProduct && (
        <ProductEditDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onSuccess={() => {
            toast.success('Product updated successfully');
            setEditingProduct(null);
          }}
          onError={(error) => {
            toast.error(error);
          }}
        />
      )}

      {/* Delete Product Confirmation */}
      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This will also remove all associated listings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={removeProductMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
