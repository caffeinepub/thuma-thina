import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDashboardData, useAddProduct, useAddRetailer, useAddListing, useAllProducts, useAllRetailers, useProvinces } from '../../hooks/useQueries';
import { Package, Store, List, AlertCircle, BarChart3, Loader2 } from 'lucide-react';
import { ListingStatus } from '../../backend';

export function AdminDashboardPage() {
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardData();
  const { data: provinces } = useProvinces();
  const { data: allProducts } = useAllProducts();
  const { data: allRetailers } = useAllRetailers();

  const addProduct = useAddProduct();
  const addRetailer = useAddRetailer();
  const addListing = useAddListing();

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    description: '',
    imageRef: ''
  });

  // Retailer form state
  const [retailerForm, setRetailerForm] = useState({
    name: '',
    townSuburb: '',
    province: ''
  });

  // Listing form state
  const [listingForm, setListingForm] = useState({
    retailerId: '',
    productId: '',
    price: '',
    stock: '',
    status: ListingStatus.active
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await addProduct.mutateAsync(productForm);
      setSuccess('Product added successfully!');
      setProductForm({ name: '', category: '', description: '', imageRef: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to add product');
    }
  };

  const handleAddRetailer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await addRetailer.mutateAsync(retailerForm);
      setSuccess('Retailer added successfully!');
      setRetailerForm({ name: '', townSuburb: '', province: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to add retailer');
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

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage products, retailers, and listings</p>
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

      {/* Forms */}
      <Tabs defaultValue="product" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="product">Add Product</TabsTrigger>
          <TabsTrigger value="retailer">Add Retailer</TabsTrigger>
          <TabsTrigger value="listing">Add Listing</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-4 border-primary bg-primary/10">
            <AlertDescription className="text-primary">{success}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="product">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Create a new product in the catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g., Fresh Milk 1L"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-category">Category</Label>
                  <Input
                    id="product-category"
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    placeholder="e.g., Dairy"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Product description..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product-image">Image Reference</Label>
                  <Input
                    id="product-image"
                    value={productForm.imageRef}
                    onChange={(e) => setProductForm({ ...productForm, imageRef: e.target.value })}
                    placeholder="e.g., milk-1l.jpg"
                    required
                  />
                </div>

                <Button type="submit" disabled={addProduct.isPending} className="w-full">
                  {addProduct.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

        <TabsContent value="retailer">
          <Card>
            <CardHeader>
              <CardTitle>Add New Retailer</CardTitle>
              <CardDescription>Register a new retailer location</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddRetailer} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retailer-name">Retailer Name</Label>
                  <Input
                    id="retailer-name"
                    value={retailerForm.name}
                    onChange={(e) => setRetailerForm({ ...retailerForm, name: e.target.value })}
                    placeholder="e.g., Spar Sandton"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retailer-province">Province</Label>
                  <Select
                    value={retailerForm.province}
                    onValueChange={(value) => setRetailerForm({ ...retailerForm, province: value, townSuburb: '' })}
                  >
                    <SelectTrigger id="retailer-province">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces?.map((province) => (
                        <SelectItem key={province.name} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retailer-town">Town/Suburb</Label>
                  <Select
                    value={retailerForm.townSuburb}
                    onValueChange={(value) => setRetailerForm({ ...retailerForm, townSuburb: value })}
                    disabled={!retailerForm.province}
                  >
                    <SelectTrigger id="retailer-town">
                      <SelectValue placeholder="Select town/suburb" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces
                        ?.find((p) => p.name === retailerForm.province)
                        ?.towns.map((town) => (
                          <SelectItem key={town} value={town}>
                            {town}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={addRetailer.isPending} className="w-full">
                  {addRetailer.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Retailer'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listing">
          <Card>
            <CardHeader>
              <CardTitle>Add New Listing</CardTitle>
              <CardDescription>Create a product listing for a retailer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddListing} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="listing-retailer">Retailer</Label>
                  <Select
                    value={listingForm.retailerId}
                    onValueChange={(value) => setListingForm({ ...listingForm, retailerId: value })}
                  >
                    <SelectTrigger id="listing-retailer">
                      <SelectValue placeholder="Select retailer" />
                    </SelectTrigger>
                    <SelectContent>
                      {allRetailers?.map((r) => (
                        <SelectItem key={r.retailer.id.toString()} value={r.retailer.id.toString()}>
                          {r.retailer.name} - {r.retailer.townSuburb}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listing-product">Product</Label>
                  <Select
                    value={listingForm.productId}
                    onValueChange={(value) => setListingForm({ ...listingForm, productId: value })}
                  >
                    <SelectTrigger id="listing-product">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {allProducts?.map((p) => (
                        <SelectItem key={p.id.toString()} value={p.id.toString()}>
                          {p.name} ({p.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listing-price">Price (cents)</Label>
                  <Input
                    id="listing-price"
                    type="number"
                    value={listingForm.price}
                    onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })}
                    placeholder="e.g., 2999 for R29.99"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listing-stock">Stock Quantity</Label>
                  <Input
                    id="listing-stock"
                    type="number"
                    value={listingForm.stock}
                    onChange={(e) => setListingForm({ ...listingForm, stock: e.target.value })}
                    placeholder="e.g., 100"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listing-status">Status</Label>
                  <Select
                    value={listingForm.status}
                    onValueChange={(value) => setListingForm({ ...listingForm, status: value as ListingStatus })}
                  >
                    <SelectTrigger id="listing-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ListingStatus.active}>Active</SelectItem>
                      <SelectItem value={ListingStatus.outOfStock}>Out of Stock</SelectItem>
                      <SelectItem value={ListingStatus.discontinued}>Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={addListing.isPending} className="w-full">
                  {addListing.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
      </Tabs>
    </div>
  );
}
