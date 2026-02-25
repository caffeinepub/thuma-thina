import React, { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useListings, useDeleteListing, type Listing } from '@/hooks/useListings';
import { useProducts } from '@/hooks/useProducts';
import { useRetailers } from '@/hooks/useRetailers';
import { ListingEditDialog } from '@/components/admin/ListingEditDialog';
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
import { toast } from 'sonner';

function formatPrice(price: bigint): string {
  return `R ${(Number(price) / 100).toFixed(2)}`;
}

function getStatusVariant(status: Listing['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.__kind__) {
    case 'active': return 'default';
    case 'outOfStock': return 'secondary';
    case 'discontinued': return 'destructive';
    default: return 'outline';
  }
}

export function AdminManageListingsPage() {
  const { data: listings = [], isLoading } = useListings();
  const { data: products = [] } = useProducts();
  const { data: retailers = [] } = useRetailers();
  const deleteListing = useDeleteListing();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  const getProductName = (id: bigint) =>
    products.find(p => p.id === id)?.name ?? `Product #${id}`;
  const getRetailerName = (id: bigint) =>
    retailers.find(r => r.id === id)?.name ?? `Retailer #${id}`;

  const filtered = listings.filter(l => {
    const q = search.toLowerCase();
    return (
      getProductName(l.productId).toLowerCase().includes(q) ||
      getRetailerName(l.retailerId).toLowerCase().includes(q)
    );
  });

  const handleEdit = (listing: Listing) => {
    setEditingListing(listing);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingListing(null);
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteListing.mutateAsync(deleteTarget.id);
      toast.success('Listing deleted');
    } catch {
      toast.error('Failed to delete listing');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listings</h1>
          <p className="text-muted-foreground">Manage product listings at retailers</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Listing
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by product or retailer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          {search
            ? 'No listings match your search.'
            : 'No listings yet. Add products and retailers first, then create listings.'}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Retailer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(listing => (
                <TableRow key={listing.id.toString()}>
                  <TableCell className="font-medium">
                    {getProductName(listing.productId)}
                  </TableCell>
                  <TableCell>{getRetailerName(listing.retailerId)}</TableCell>
                  <TableCell>{formatPrice(listing.price)}</TableCell>
                  <TableCell>{listing.stock.toString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(listing.status)}>
                      {listing.status.__kind__}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(listing)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(listing)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ListingEditDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        listing={editingListing}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
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
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminManageListingsPage;
