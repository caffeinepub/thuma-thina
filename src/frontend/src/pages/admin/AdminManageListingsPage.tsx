import { useState, useMemo } from 'react';
import { Pencil, Trash2, Power, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { useAllListings, useAllRetailers, useAllProducts, useUpdateListing, useDeleteListing, useAddListing } from '@/hooks/useQueries';
import { formatZAR, parseZAR } from '@/utils/money';
import { formatICTime } from '@/utils/time';
import { ListingStatus } from '@/backend';
import type { Listing, Retailer, Product } from '@/backend';
import { toast } from 'sonner';

export default function AdminManageListingsPage() {
  const { data: listings = [], isLoading: listingsLoading } = useAllListings();
  const { data: retailers = [], isLoading: retailersLoading } = useAllRetailers();
  const { data: products = [], isLoading: productsLoading } = useAllProducts();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Edit form state
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editStatus, setEditStatus] = useState<string>('active');

  // Create form state
  const [createRetailerId, setCreateRetailerId] = useState('');
  const [createProductId, setCreateProductId] = useState('');
  const [createPrice, setCreatePrice] = useState('');
  const [createStock, setCreateStock] = useState('');
  const [createStatus, setCreateStatus] = useState<string>('active');

  const updateMutation = useUpdateListing();
  const deleteMutation = useDeleteListing();
  const createMutation = useAddListing();

  // Group listings by retailer
  const listingsByRetailer = useMemo(() => {
    const grouped = new Map<string, { retailer: Retailer; listings: Listing[] }>();
    
    listings.forEach((listing) => {
      const retailer = retailers.find((r) => r.id === listing.retailerId);
      if (retailer) {
        const key = retailer.id.toString();
        if (!grouped.has(key)) {
          grouped.set(key, { retailer, listings: [] });
        }
        grouped.get(key)!.listings.push(listing);
      }
    });

    return Array.from(grouped.values()).sort((a, b) => 
      a.retailer.name.localeCompare(b.retailer.name)
    );
  }, [listings, retailers]);

  const getProductName = (productId: bigint) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.active:
        return <Badge variant="default" className="bg-success text-success-foreground">Active</Badge>;
      case ListingStatus.outOfStock:
        return <Badge variant="secondary">Out of Stock</Badge>;
      case ListingStatus.discontinued:
        return <Badge variant="destructive">Discontinued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setEditPrice((Number(listing.price)).toString());
    setEditStock(listing.stock.toString());
    setEditStatus(listing.status);
    setEditDialogOpen(true);
  };

  const handleDisable = async (listing: Listing) => {
    try {
      await updateMutation.mutateAsync({
        listingId: listing.id,
        status: ListingStatus.outOfStock
      });
      toast.success('Listing disabled successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to disable listing');
    }
  };

  const handleDelete = (listing: Listing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedListing) return;

    try {
      const priceValue = parseZAR(editPrice);
      const stockValue = BigInt(editStock);

      await updateMutation.mutateAsync({
        listingId: selectedListing.id,
        price: priceValue,
        stock: stockValue,
        status: editStatus as ListingStatus
      });

      toast.success('Listing updated successfully');
      setEditDialogOpen(false);
      setSelectedListing(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update listing');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedListing) return;

    try {
      await deleteMutation.mutateAsync(selectedListing.id);
      toast.success('Listing deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete listing');
    }
  };

  const handleCreateListing = async () => {
    try {
      const priceValue = parseZAR(createPrice);
      const stockValue = BigInt(createStock);

      await createMutation.mutateAsync({
        retailerId: BigInt(createRetailerId),
        productId: BigInt(createProductId),
        price: priceValue,
        stock: stockValue,
        status: createStatus as ListingStatus
      });

      toast.success('Listing created successfully');
      setCreateDialogOpen(false);
      // Reset form
      setCreateRetailerId('');
      setCreateProductId('');
      setCreatePrice('');
      setCreateStock('');
      setCreateStatus('active');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create listing');
    }
  };

  const isLoading = listingsLoading || retailersLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Listings</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all product listings across retailers
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Listing
        </Button>
      </div>

      {listingsByRetailer.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No listings found. Create your first listing to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {listingsByRetailer.map(({ retailer, listings: retailerListings }) => (
            <Card key={retailer.id.toString()}>
              <CardHeader>
                <CardTitle>{retailer.name}</CardTitle>
                <CardDescription>
                  {retailer.townSuburb}, {retailer.province} • {retailerListings.length} listing{retailerListings.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Listed Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {retailerListings.map((listing) => (
                      <TableRow key={listing.id.toString()}>
                        <TableCell className="font-medium">
                          {getProductName(listing.productId)}
                        </TableCell>
                        <TableCell>{formatICTime(listing.createdAt)}</TableCell>
                        <TableCell>{formatZAR(listing.price)}</TableCell>
                        <TableCell>{listing.stock.toString()}</TableCell>
                        <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(listing)}
                              title="Edit listing"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDisable(listing)}
                              disabled={listing.status === ListingStatus.outOfStock}
                              title="Disable listing"
                            >
                              <Power className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(listing)}
                              title="Delete listing"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>
              Update the price, stock, and status for this listing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (ZAR)</Label>
              <Input
                id="edit-price"
                type="text"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="e.g., 25.99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stock">Stock Quantity</Label>
              <Input
                id="edit-stock"
                type="number"
                min="0"
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <SearchableSelect
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'outOfStock', label: 'Out of Stock' },
                  { value: 'discontinued', label: 'Discontinued' }
                ]}
                value={editStatus}
                onValueChange={setEditStatus}
                placeholder="Select status"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Listing</DialogTitle>
            <DialogDescription>
              Add a new product listing to a retailer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-retailer">Retailer</Label>
              <SearchableSelect
                options={retailers.map((r) => ({
                  value: r.id.toString(),
                  label: `${r.name} (${r.townSuburb})`,
                  searchText: `${r.name} ${r.townSuburb} ${r.province}`
                }))}
                value={createRetailerId}
                onValueChange={setCreateRetailerId}
                placeholder="Select retailer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-product">Product</Label>
              <SearchableSelect
                options={products.map((p) => ({
                  value: p.id.toString(),
                  label: p.name,
                  searchText: `${p.name} ${p.category}`
                }))}
                value={createProductId}
                onValueChange={setCreateProductId}
                placeholder="Select product"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-price">Price (ZAR)</Label>
              <Input
                id="create-price"
                type="text"
                value={createPrice}
                onChange={(e) => setCreatePrice(e.target.value)}
                placeholder="e.g., 25.99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-stock">Stock Quantity</Label>
              <Input
                id="create-stock"
                type="number"
                min="0"
                value={createStock}
                onChange={(e) => setCreateStock(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-status">Status</Label>
              <SearchableSelect
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'outOfStock', label: 'Out of Stock' },
                  { value: 'discontinued', label: 'Discontinued' }
                ]}
                value={createStatus}
                onValueChange={setCreateStatus}
                placeholder="Select status"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateListing} 
              disabled={createMutation.isPending || !createRetailerId || !createProductId || !createPrice || !createStock}
            >
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
