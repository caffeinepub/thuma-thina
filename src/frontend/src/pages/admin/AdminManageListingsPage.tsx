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
import { Plus, Search, Edit, List, Trash2 } from 'lucide-react';
import { useListListings, useDeleteListing } from '@/hooks/useListings';
import { useListProducts } from '@/hooks/useProducts';
import { useListRetailers } from '@/hooks/useRetailers';
import { ListingEditDialog } from '@/components/admin/ListingEditDialog';
import { formatZAR } from '@/utils/money';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';
import type { NewListing, ListingStatus } from '@/backend';

export function AdminManageListingsPage() {
  const { data: listings, isLoading } = useListListings();
  const { data: products } = useListProducts();
  const { data: retailers } = useListRetailers();
  const deleteListing = useDeleteListing();

  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<NewListing | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<NewListing | null>(null);

  const getProductName = (productId: bigint) => {
    const product = products?.find((p) => p.id === productId);
    return product?.name || `Product #${productId}`;
  };

  const getRetailerName = (retailerId: bigint) => {
    const retailer = retailers?.find((r) => r.id === retailerId);
    return retailer?.name || `Retailer #${retailerId}`;
  };

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'outOfStock':
        return <Badge variant="secondary">Out of Stock</Badge>;
      case 'discontinued':
        return <Badge variant="destructive">Discontinued</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredListings = listings?.filter((listing) => {
    const productName = getProductName(listing.productId).toLowerCase();
    const retailerName = getRetailerName(listing.retailerId).toLowerCase();
    const search = searchTerm.toLowerCase();
    return productName.includes(search) || retailerName.includes(search);
  });

  const handleCreateNew = () => {
    setSelectedListing(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (listing: NewListing) => {
    setSelectedListing(listing);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (listing: NewListing) => {
    setListingToDelete(listing);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;

    try {
      await deleteListing.mutateAsync(listingToDelete.id);
      toast.success('Listing deleted successfully');
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete listing');
    }
  };

  const retailerOptions = (retailers || []).map((r) => ({
    id: r.id,
    name: r.name,
  }));

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Listings Management</h1>
            <p className="text-muted-foreground">Link products to retailers with prices</p>
          </div>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Listings</CardTitle>
                <CardDescription>{listings?.length || 0} listings</CardDescription>
              </div>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Listing
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading listings...</div>
              ) : !filteredListings || filteredListings.length === 0 ? (
                <div className="text-center py-12">
                  <List className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No listings match your search' : 'No listings yet'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateNew}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Listing
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Retailer</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={Number(listing.id)}>
                        <TableCell className="font-medium">{getProductName(listing.productId)}</TableCell>
                        <TableCell>{getRetailerName(listing.retailerId)}</TableCell>
                        <TableCell>{formatZAR(listing.price)}</TableCell>
                        <TableCell>{Number(listing.stock)}</TableCell>
                        <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(listing)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(listing)}
                              disabled={deleteListing.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <ListingEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          listing={selectedListing}
          retailers={retailerOptions}
        />

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
              <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteListing.isPending}>
                {deleteListing.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
