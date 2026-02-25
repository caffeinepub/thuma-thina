import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProducts } from '@/hooks/useProducts';
import { useRetailers } from '@/hooks/useRetailers';
import { useCreateListing, useUpdateListing, type Listing, type ListingInput } from '@/hooks/useListings';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ListingEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: Listing | null;
}

export function ListingEditDialog({ open, onOpenChange, listing }: ListingEditDialogProps) {
  const { data: products = [] } = useProducts();
  const { data: retailers = [] } = useRetailers();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();

  const [productId, setProductId] = useState('');
  const [retailerId, setRetailerId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState<'active' | 'outOfStock' | 'discontinued'>('active');

  const isEditing = !!listing;
  const isPending = createListing.isPending || updateListing.isPending;

  useEffect(() => {
    if (open) {
      if (listing) {
        setProductId(listing.productId.toString());
        setRetailerId(listing.retailerId.toString());
        setPrice((Number(listing.price) / 100).toFixed(2));
        setStock(listing.stock.toString());
        setStatus(listing.status.__kind__ as 'active' | 'outOfStock' | 'discontinued');
      } else {
        setProductId('');
        setRetailerId('');
        setPrice('');
        setStock('100');
        setStatus('active');
      }
    }
  }, [open, listing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId) {
      toast.error('Please select a product');
      return;
    }
    if (!retailerId) {
      toast.error('Please select a retailer');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error('Please enter a valid price');
      return;
    }

    const input: ListingInput = {
      productId: BigInt(productId),
      retailerId: BigInt(retailerId),
      price: BigInt(Math.round(priceNum * 100)),
      stock: BigInt(parseInt(stock) || 0),
      status,
    };

    try {
      if (isEditing && listing) {
        await updateListing.mutateAsync({ id: listing.id, input });
        toast.success('Listing updated successfully');
      } else {
        await createListing.mutateAsync(input);
        toast.success('Listing created successfully');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(isEditing ? 'Failed to update listing' : 'Failed to create listing');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Listing' : 'Add New Listing'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="listing-product">Product *</Label>
            <Select value={productId} onValueChange={setProductId} disabled={isPending}>
              <SelectTrigger id="listing-product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No products available — add products first
                  </SelectItem>
                ) : (
                  products.map(p => (
                    <SelectItem key={p.id.toString()} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="listing-retailer">Retailer *</Label>
            <Select value={retailerId} onValueChange={setRetailerId} disabled={isPending}>
              <SelectTrigger id="listing-retailer">
                <SelectValue placeholder="Select a retailer" />
              </SelectTrigger>
              <SelectContent>
                {retailers.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No retailers available — add retailers first
                  </SelectItem>
                ) : (
                  retailers.map(r => (
                    <SelectItem key={r.id.toString()} value={r.id.toString()}>
                      {r.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listing-price">Price (ZAR) *</Label>
              <Input
                id="listing-price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="listing-stock">Stock</Label>
              <Input
                id="listing-stock"
                type="number"
                min="0"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="100"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="listing-status">Status</Label>
            <Select
              value={status}
              onValueChange={v => setStatus(v as 'active' | 'outOfStock' | 'discontinued')}
              disabled={isPending}
            >
              <SelectTrigger id="listing-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Listing' : 'Create Listing'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ListingEditDialog;
