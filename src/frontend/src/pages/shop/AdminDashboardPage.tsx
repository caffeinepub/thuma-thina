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
import { useDashboardData, useAddProduct, useAddListing, useAllProducts, useAllRetailers, useAdminAnalytics, useAddImageRef, useSetPreferredImage, useRemoveImage } from '../../hooks/useQueries';
import { Package, Store, List, AlertCircle, BarChart3, Loader2, Upload, X, Star, TrendingUp, Users, ShoppingCart, Truck, Settings } from 'lucide-react';
import { ListingStatus, type Product, type ProductId } from '../../backend';
import { DangerZoneWipeSystemCard } from '../../components/admin/DangerZoneWipeSystemCard';
import { canAddMoreImages, getRemainingImageSlots, getImageUrl, getAllImages } from '../../utils/productImages';
import { SearchableSelect, type SearchableSelectOption } from '../../components/admin/SearchableSelect';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardData();
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useAdminAnalytics();
  const { data: allProducts } = useAllProducts();
  const { data: allRetailers } = useAllRetailers();

  const addProduct = useAddProduct();
  const addListing = useAddListing();
  const addImageRef = useAddImageRef();
  const setPreferredImage = useSetPreferredImage();
  const removeImage = useRemoveImage();

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    description: '',
    imageFile: null as File | null
  });

  // Listing form state
  const [listingForm, setListingForm] = useState({
    retailerId: '',
    productId: '',
    price: '',
    stock: '',
    status: ListingStatus.active
  });

  // Image management state
  const [selectedProductForImages, setSelectedProductForImages] = useState<ProductId | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await addProduct.mutateAsync({
        name: productForm.name,
        category: productForm.category,
        description: productForm.description,
        preferredImage: productForm.imageFile || undefined
      });
      setSuccess('Product added successfully!');
      setProductForm({ name: '', category: '', description: '', imageFile: null });
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    }
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await addListing.mutateAsync({
        retailerId: BigInt(listingForm.retailerId),
        productId: BigInt(listingForm.productId),
        price: BigInt(listingForm.price),
        stock: BigInt(listingForm.stock),
        status: listingForm.status
      });
      setSuccess('Listing added successfully!');
      setListingForm({ retailerId: '', productId: '', price: '', stock: '', status: ListingStatus.active });
    } catch (err: any) {
      setError(err.message || 'Failed to add listing');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!selectedProductForImages) {
      setError('Please select a product first');
      return;
    }

    const selectedProduct = allProducts?.find(p => p.id === selectedProductForImages);
    if (!selectedProduct) {
      setError('Product not found');
      return;
    }

    if (!canAddMoreImages(selectedProduct)) {
      setError('Maximum of 3 images allowed per product');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await addImageRef.mutateAsync({
        productId: selectedProductForImages,
        imageFile: file,
        onProgress: (percentage) => setUploadProgress(percentage)
      });
      setSuccess('Image uploaded successfully!');
      setUploadProgress(0);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (productId: ProductId, imageIndex: number) => {
    setError(null);
    try {
      await removeImage.mutateAsync({
        productId,
        imageIndex: BigInt(imageIndex)
      });
      setSuccess('Image removed successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to remove image');
    }
  };

  const handleSetPreferred = async (productId: ProductId, imageIndex: number) => {
    setError(null);
    const product = allProducts?.find(p => p.id === productId);
    if (!product) return;

    const allImages = getAllImages(product);
    const selectedImage = allImages[imageIndex];

    try {
      await setPreferredImage.mutateAsync({
        productId,
        preferredImage: selectedImage
      });
      setSuccess('Primary image updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to set primary image');
    }
  };

  const selectedProduct = allProducts?.find(p => p.id === selectedProductForImages);
  const selectedProductImages = selectedProduct ? getAllImages(selectedProduct) : [];

  // Prepare options for searchable selects
  const retailerOptions: SearchableSelectOption[] = (allRetailers || []).map(rwl => ({
    value: rwl.retailer.id.toString(),
    label: `${rwl.retailer.name} (${rwl.retailer.townSuburb})`,
    searchText: `${rwl.retailer.name} ${rwl.retailer.townSuburb} ${rwl.retailer.province}`
  }));

  const productOptions: SearchableSelectOption[] = (allProducts || []).map(product => ({
    value: product.id.toString(),
    label: `${product.name} - ${product.category}`,
    searchText: `${product.name} ${product.category} ${product.description}`
  }));

  return (
    <div className="container-custom py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage products, retailers, listings, and view analytics</p>
        </div>
        <Button
          onClick={() => navigate({ to: '/admin/retailers' })}
          variant="outline"
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Manage Retailers
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.products.toString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retailers</CardTitle>
            <Store className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.retailers.toString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listings</CardTitle>
            <List className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.listings.toString() || '0'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Requests</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : dashboardData?.requests.toString() || '0'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Analytics Overview
          </CardTitle>
          <CardDescription>Platform performance and user behavior insights</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {analyticsError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{analyticsError.message}</AlertDescription>
            </Alert>
          )}

          {analytics && !analyticsLoading && (
            <div className="space-y-6">
              {/* Sales & Orders */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border-2 border-border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold">R {Number(analytics.totalSales).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Package className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Orders</p>
                      <p className="text-2xl font-bold">{analytics.ordersCount.toString()}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Truck className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Deliveries</p>
                      <p className="text-2xl font-bold">{analytics.deliveriesCount.toString()}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border-2 border-border bg-card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-muted">
                      <Users className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">
                        {(Number(analytics.activeShoppers) + Number(analytics.activeDrivers)).toString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products & Retailers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Top Products
                  </h3>
                  {analytics.favouriteProducts.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.favouriteProducts.slice(0, 5).map((product) => (
                        <div key={product.id.toString()} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-sm text-muted-foreground">{product.category}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No data available yet</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Store className="h-5 w-5 text-accent" />
                    Top Retailers
                  </h3>
                  {analytics.favouriteRetailers.length > 0 ? (
                    <div className="space-y-2">
                      {analytics.favouriteRetailers.slice(0, 5).map((retailer: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                          <span className="font-medium">{retailer.name}</span>
                          <span className="text-sm text-muted-foreground">{retailer.townSuburb}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No data available yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <AlertDescription className="text-primary">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="images">Product Images</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Create a new product in the catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Product Name</Label>
                    <Input
                      id="product-name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="Enter product name"
                      disabled={addProduct.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Category</Label>
                    <Input
                      id="product-category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      placeholder="Enter category"
                      disabled={addProduct.isPending}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                    disabled={addProduct.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-image">Product Image (Optional)</Label>
                  <Input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setProductForm({ ...productForm, imageFile: file });
                    }}
                    disabled={addProduct.isPending}
                  />
                  <p className="text-xs text-muted-foreground">Upload an image for this product</p>
                </div>
                <Button type="submit" disabled={addProduct.isPending}>
                  {addProduct.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Product
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Add New Listing</CardTitle>
              <CardDescription>Create a listing for a product at a retailer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddListing} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="listing-retailer">Retailer</Label>
                    <SearchableSelect
                      options={retailerOptions}
                      value={listingForm.retailerId}
                      onValueChange={(value) => setListingForm({ ...listingForm, retailerId: value })}
                      placeholder="Select retailer"
                      emptyText="No retailers found"
                      disabled={addListing.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listing-product">Product</Label>
                    <SearchableSelect
                      options={productOptions}
                      value={listingForm.productId}
                      onValueChange={(value) => setListingForm({ ...listingForm, productId: value })}
                      placeholder="Select product"
                      emptyText="No products found"
                      disabled={addListing.isPending}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="listing-price">Price (R)</Label>
                    <Input
                      id="listing-price"
                      type="number"
                      value={listingForm.price}
                      onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })}
                      placeholder="0.00"
                      step="0.01"
                      disabled={addListing.isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listing-stock">Stock</Label>
                    <Input
                      id="listing-stock"
                      type="number"
                      value={listingForm.stock}
                      onChange={(e) => setListingForm({ ...listingForm, stock: e.target.value })}
                      placeholder="0"
                      disabled={addListing.isPending}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={addListing.isPending}>
                  {addListing.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Listing
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Manage Product Images</CardTitle>
              <CardDescription>Upload, remove, and set primary images for products (max 3 per product)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image-product">Select Product</Label>
                <SearchableSelect
                  options={productOptions}
                  value={selectedProductForImages?.toString() || ''}
                  onValueChange={(value) => setSelectedProductForImages(value ? BigInt(value) : null)}
                  placeholder="Select product"
                  emptyText="No products found"
                />
              </div>

              {selectedProductForImages && selectedProduct && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      disabled={isUploading || !canAddMoreImages(selectedProduct)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {getRemainingImageSlots(selectedProduct)} of 3 slots available
                    </p>
                    {isUploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} />
                        <p className="text-xs text-muted-foreground text-center">{uploadProgress}%</p>
                      </div>
                    )}
                  </div>

                  {selectedProductImages.length > 0 && (
                    <div>
                      <Label className="mb-3 block">Current Images</Label>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {selectedProductImages.map((image, index) => (
                          <Card key={index} className="overflow-hidden">
                            <div className="aspect-square bg-muted relative">
                              <img
                                src={getImageUrl(image)}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  Primary
                                </div>
                              )}
                            </div>
                            <CardContent className="p-3 flex gap-2">
                              {index !== 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSetPreferred(selectedProductForImages, index)}
                                  disabled={setPreferredImage.isPending}
                                  className="flex-1"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  Set Primary
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveImage(selectedProductForImages, index)}
                                disabled={removeImage.isPending}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Remove
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <DangerZoneWipeSystemCard />
      </div>
    </div>
  );
}
