import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useDashboardData, useAddProduct, useAddListing, useAllProducts, useAllRetailers, useAdminAnalytics, useAddImageRef, useSetPreferredImage, useRemoveImage, useRemoveProduct } from '../../hooks/useQueries';
import { Package, Store, List, AlertCircle, BarChart3, Loader2, Upload, X, Star, TrendingUp, Users, ShoppingCart, Truck, Settings, Edit, Trash2 } from 'lucide-react';
import { ListingStatus, type Product, type ProductId } from '../../backend';
import { DangerZoneWipeSystemCard } from '../../components/admin/DangerZoneWipeSystemCard';
import { canAddMoreImages, getRemainingImageSlots, getImageUrl, getAllImages } from '../../utils/productImages';
import { SearchableSelect, type SearchableSelectOption } from '../../components/admin/SearchableSelect';
import { ProductEditDialog } from '../../components/admin/ProductEditDialog';
import { formatZAR, parseZAR, isValidZAR } from '../../utils/money';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardData();
  const { data: analytics, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: allProducts } = useAllProducts();
  const { data: allRetailers } = useAllRetailers();

  // Product form state
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState<File | null>(null);

  // Listing form state
  const [selectedRetailerId, setSelectedRetailerId] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [listingPrice, setListingPrice] = useState('');
  const [listingStock, setListingStock] = useState('');
  const [listingStatus, setListingStatus] = useState<ListingStatus>(ListingStatus.active);

  // Image management state
  const [selectedProductForImages, setSelectedProductForImages] = useState<ProductId | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Product edit state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product deletion state
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const addProductMutation = useAddProduct();
  const addListingMutation = useAddListing();
  const addImageMutation = useAddImageRef();
  const setPreferredImageMutation = useSetPreferredImage();
  const removeImageMutation = useRemoveImage();
  const removeProductMutation = useRemoveProduct();

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProductMutation.mutateAsync({
        name: productName,
        category: productCategory,
        description: productDescription,
        preferredImage: productImage || undefined
      });
      setProductName('');
      setProductCategory('');
      setProductDescription('');
      setProductImage(null);
    } catch (error: any) {
      console.error('Error adding product:', error);
    }
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRetailerId || !selectedProductId || !listingPrice || !listingStock) {
      return;
    }

    if (!isValidZAR(listingPrice)) {
      return;
    }

    try {
      await addListingMutation.mutateAsync({
        retailerId: BigInt(selectedRetailerId),
        productId: BigInt(selectedProductId),
        price: parseZAR(listingPrice),
        stock: BigInt(listingStock),
        status: listingStatus
      });
      setSelectedRetailerId('');
      setSelectedProductId('');
      setListingPrice('');
      setListingStock('');
      setListingStatus(ListingStatus.active);
    } catch (error: any) {
      console.error('Error adding listing:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedProductForImages) return;
    
    const file = e.target.files[0];
    setUploadProgress(0);
    
    try {
      await addImageMutation.mutateAsync({
        productId: selectedProductForImages,
        imageFile: file,
        onProgress: (percentage) => setUploadProgress(percentage)
      });
      setUploadProgress(0);
      e.target.value = '';
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setUploadProgress(0);
    }
  };

  const handleSetPreferredImage = async (productId: ProductId, imageIndex: number) => {
    const product = allProducts?.find(p => p.id === productId);
    if (!product) return;
    
    const allImages = getAllImages(product);
    const selectedImage = allImages[imageIndex];
    
    try {
      await setPreferredImageMutation.mutateAsync({
        productId,
        preferredImage: selectedImage
      });
    } catch (error: any) {
      console.error('Error setting preferred image:', error);
    }
  };

  const handleRemoveImage = async (productId: ProductId, imageIndex: number) => {
    try {
      await removeImageMutation.mutateAsync({
        productId,
        imageIndex: BigInt(imageIndex)
      });
    } catch (error: any) {
      console.error('Error removing image:', error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    
    try {
      await removeProductMutation.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
    }
  };

  const retailerOptions: SearchableSelectOption[] = (allRetailers || []).map(r => ({
    value: r.id.toString(),
    label: `${r.name} (${r.townSuburb})`
  }));

  const productOptions: SearchableSelectOption[] = (allProducts || []).map(p => ({
    value: p.id.toString(),
    label: `${p.name} - ${p.category}`
  }));

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage products, listings, and system settings
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/admin/retailers' })}
            className="hover:bg-primary/10 hover:text-primary"
          >
            <Store className="h-4 w-4 mr-2" />
            Manage Retailers
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Retailers</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? '...' : Number(dashboardData?.retailers || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? '...' : Number(dashboardData?.products || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? '...' : Number(dashboardData?.listings || 0)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Product Requests</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? '...' : Number(dashboardData?.requests || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="catalogue">Catalogue</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Add New Product
                </CardTitle>
                <CardDescription>
                  Create a new product in the universal catalogue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g., Fresh Milk 2L"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Category</Label>
                      <Input
                        id="productCategory"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        placeholder="e.g., Dairy"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Product description..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productImage">Product Image (Optional)</Label>
                    <Input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductImage(e.target.files?.[0] || null)}
                    />
                  </div>
                  {addProductMutation.isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {addProductMutation.error?.message || 'Failed to add product'}
                      </AlertDescription>
                    </Alert>
                  )}
                  {addProductMutation.isSuccess && (
                    <Alert className="border-green-500 text-green-700 bg-green-50">
                      <AlertDescription>Product added successfully!</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    disabled={addProductMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {addProductMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Product'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <List className="h-5 w-5 mr-2" />
                  Add New Listing
                </CardTitle>
                <CardDescription>
                  Create a listing for a product at a specific retailer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddListing} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="retailer">Retailer</Label>
                      <SearchableSelect
                        options={retailerOptions}
                        value={selectedRetailerId}
                        onValueChange={setSelectedRetailerId}
                        placeholder="Select retailer..."
                        emptyText="No retailers found"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product">Product</Label>
                      <SearchableSelect
                        options={productOptions}
                        value={selectedProductId}
                        onValueChange={setSelectedProductId}
                        placeholder="Select product..."
                        emptyText="No products found"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (ZAR)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                        placeholder="e.g., 217.00"
                        required
                      />
                      <p className="text-xs text-muted-foreground">Enter price in rands (e.g., 217 for R217)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={listingStock}
                        onChange={(e) => setListingStock(e.target.value)}
                        placeholder="e.g., 50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <select
                        id="status"
                        value={listingStatus}
                        onChange={(e) => setListingStatus(e.target.value as ListingStatus)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value={ListingStatus.active}>Active</option>
                        <option value={ListingStatus.outOfStock}>Out of Stock</option>
                        <option value={ListingStatus.discontinued}>Discontinued</option>
                      </select>
                    </div>
                  </div>
                  {addListingMutation.isError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {addListingMutation.error?.message || 'Failed to add listing'}
                      </AlertDescription>
                    </Alert>
                  )}
                  {addListingMutation.isSuccess && (
                    <Alert className="border-green-500 text-green-700 bg-green-50">
                      <AlertDescription>Listing added successfully!</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="submit"
                    disabled={addListingMutation.isPending}
                    className="w-full sm:w-auto"
                  >
                    {addListingMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Listing'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Catalogue Tab */}
          <TabsContent value="catalogue" className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Universal Product Catalogue
                </CardTitle>
                <CardDescription>
                  Manage all products and their images
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!allProducts || allProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No products yet. Add your first product above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Images</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allProducts.map((product) => {
                          const allImages = getAllImages(product);
                          const canAddMore = canAddMoreImages(product);
                          const remaining = getRemainingImageSlots(product);
                          
                          return (
                            <TableRow key={product.id.toString()}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {allImages.length > 0 ? (
                                    <div className="flex gap-1">
                                      {allImages.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                          <img
                                            src={getImageUrl(img)}
                                            alt={`${product.name} ${idx + 1}`}
                                            className="h-10 w-10 object-cover rounded border"
                                          />
                                          <button
                                            onClick={() => handleRemoveImage(product.id, idx)}
                                            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <X className="h-3 w-3" />
                                          </button>
                                          {product.preferredImage && getImageUrl(product.preferredImage) === getImageUrl(img) && (
                                            <Star className="absolute -bottom-1 -right-1 h-3 w-3 text-yellow-500 fill-yellow-500" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">No images</span>
                                  )}
                                  {canAddMore && (
                                    <label className="cursor-pointer">
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                          setSelectedProductForImages(product.id);
                                          handleImageUpload(e);
                                        }}
                                      />
                                      <div className="h-10 w-10 border-2 border-dashed border-border rounded flex items-center justify-center hover:border-primary transition-colors">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </label>
                                  )}
                                </div>
                                {uploadProgress > 0 && selectedProductForImages === product.id && (
                                  <Progress value={uploadProgress} className="mt-2" />
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setEditingProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeletingProduct(product)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{deletingProduct?.name}"? This will also remove all associated listings. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => setDeletingProduct(null)}>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={handleDeleteProduct}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          {removeProductMutation.isPending ? (
                                            <>
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                              Deleting...
                                            </>
                                          ) : (
                                            'Delete'
                                          )}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <DangerZoneWipeSystemCard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Edit Dialog */}
      {editingProduct && (
        <ProductEditDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => !open && setEditingProduct(null)}
          onSuccess={() => setEditingProduct(null)}
          onError={(error) => console.error('Edit error:', error)}
        />
      )}
    </div>
  );
}
