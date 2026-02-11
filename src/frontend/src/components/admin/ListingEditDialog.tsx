import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateListing, useUpdateListing, useSetPromo, useRemovePromo } from '@/hooks/useListings';
import { useListProducts } from '@/hooks/useProducts';
import { SearchableSelect } from './SearchableSelect';
import { ListingStatus, type NewListing, type ProductId, type RetailerId } from '@/backend';
import { parseZAR, isValidZAR, formatZAR } from '@/utils/money';
import { toast } from 'sonner';

interface ListingEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: NewListing | null;
  retailers: Array<{ id: RetailerId; name: string }>;
}

export function ListingEditDialog({ open, onOpenChange, listing, retailers }: ListingEditDialogProps) {
  const [retailerId, setRetailerId] = useState('');
  const [productId, setProductId] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [status, setStatus] = useState<ListingStatus>(ListingStatus.active);

  // Promo fields
  const [hasPromo, setHasPromo] = useState(false);
  const [promoPrice, setPromoPrice] = useState('');
  const [promoStartDate, setPromoStartDate] = useState('');
  const [promoStartTime, setPromoStartTime] = useState('');
  const [promoEndDate, setPromoEndDate] = useState('');
  const [promoEndTime, setPromoEndTime] = useState('');
  const [promoIndefinite, setPromoIndefinite] = useState(false);

  const { data: products } = useListProducts();
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const setPromo = useSetPromo();
  const removePromo = useRemovePromo();

  const isEditing = !!listing;
  const isLoading = createListing.isPending || updateListing.isPending || setPromo.isPending || removePromo.isPending;

  useEffect(() => {
    if (listing) {
      setRetailerId(listing.retailerId.toString());
      setProductId(listing.productId.toString());
      setPrice(Number(listing.price).toString());
      setStock(Number(listing.stock).toString());
      setStatus(listing.status);

      // Load promo data if exists
      if (listing.promo) {
        setHasPromo(true);
        setPromoPrice(Number(listing.promo.price).toString());
        
        const startDate = new Date(Number(listing.promo.startDate) / 1_000_000);
        setPromoStartDate(startDate.toISOString().split('T')[0]);
        setPromoStartTime(startDate.toTimeString().slice(0, 5));

        if (listing.promo.endDate) {
          const endDate = new Date(Number(listing.promo.endDate) / 1_000_000);
          setPromoEndDate(endDate.toISOString().split('T')[0]);
          setPromoEndTime(endDate.toTimeString().slice(0, 5));
          setPromoIndefinite(false);
        } else {
          setPromoEndDate('');
          setPromoEndTime('');
          setPromoIndefinite(true);
        }
      } else {
        setHasPromo(false);
        setPromoPrice('');
        setPromoStartDate('');
        setPromoStartTime('');
        setPromoEndDate('');
        setPromoEndTime('');
        setPromoIndefinite(false);
      }
    } else {
      setRetailerId('');
      setProductId('');
      setPrice('');
      setStock('');
      setStatus(ListingStatus.active);
      setHasPromo(false);
      setPromoPrice('');
      setPromoStartDate('');
      setPromoStartTime('');
      setPromoEndDate('');
      setPromoEndTime('');
      setPromoIndefinite(false);
    }
  }, [listing, open]);

  const productOptions = (products || []).map((p) => ({
    value: p.id.toString(),
    label: p.name,
  }));

  const retailerOptions = retailers.map((r) => ({
    value: r.id.toString(),
    label: r.name,
  }));

  const computeSavings = () => {
    if (!hasPromo || !price || !promoPrice) return null;
    const normalPrice = parseFloat(price);
    const promo = parseFloat(promoPrice);
    if (isNaN(normalPrice) || isNaN(promo)) return null;
    const savings = normalPrice - promo;
    return savings > 0 ? savings : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!retailerId) {
      toast.error('Please select a retailer');
      return;
    }

    if (!productId) {
      toast.error('Please select a product');
      return;
    }

    if (!price || !isValidZAR(price)) {
      toast.error('Please enter a valid price');
      return;
    }

    if (!stock || parseInt(stock) < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    // Validate promo fields if promo is enabled
    if (hasPromo) {
      if (!promoPrice || !isValidZAR(promoPrice)) {
        toast.error('Please enter a valid promo price');
        return;
      }

      const normalPrice = parseFloat(price);
      const promo = parseFloat(promoPrice);
      if (promo >= normalPrice) {
        toast.error('Promo price must be less than normal price');
        return;
      }

      if (!promoStartDate || !promoStartTime) {
        toast.error('Please enter promo start date and time');
        return;
      }

      if (!promoIndefinite && (!promoEndDate || !promoEndTime)) {
        toast.error('Please enter promo end date and time or mark as indefinite');
        return;
      }
    }

    try {
      const priceValue = parseZAR(price);
      const stockValue = BigInt(parseInt(stock));

      let listingId: bigint;

      if (isEditing && listing) {
        // Update existing listing
        await updateListing.mutateAsync({
          id: listing.id,
          price: priceValue,
          stock: stockValue,
          status,
        });
        listingId = listing.id;
        toast.success('Listing updated successfully');
      } else {
        // Create new listing
        const newListing = await createListing.mutateAsync({
          retailerId: BigInt(retailerId) as RetailerId,
          productId: BigInt(productId) as ProductId,
          price: priceValue,
          stock: stockValue,
        });
        listingId = newListing.id;
        toast.success('Listing created successfully');
      }

      // Handle promo configuration
      if (hasPromo) {
        const promoPriceValue = parseZAR(promoPrice);
        const startDateTime = new Date(`${promoStartDate}T${promoStartTime}`);
        const startNanos = BigInt(startDateTime.getTime()) * BigInt(1_000_000);

        let endNanos: bigint | null = null;
        if (!promoIndefinite) {
          const endDateTime = new Date(`${promoEndDate}T${promoEndTime}`);
          endNanos = BigInt(endDateTime.getTime()) * BigInt(1_000_000);
        }

        await setPromo.mutateAsync({
          id: listingId,
          price: promoPriceValue,
          startDate: startNanos,
          endDate: endNanos,
        });
        toast.success('Promo pricing configured');
      } else if (isEditing && listing?.promo) {
        // Remove promo if it was previously set
        await removePromo.mutateAsync(listingId);
        toast.success('Promo pricing removed');
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save listing');
    }
  };

  const savings = computeSavings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Listing' : 'Create Listing'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Listing Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="retailer">Retailer *</Label>
              <SearchableSelect
                options={retailerOptions}
                value={retailerId}
                onValueChange={setRetailerId}
                placeholder="Select retailer"
                disabled={isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <SearchableSelect
                options={productOptions}
                value={productId}
                onValueChange={setProductId}
                placeholder="Select product"
                disabled={isEditing}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Normal Price (ZAR) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as ListingStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ListingStatus.active}>Active</SelectItem>
                  <SelectItem value={ListingStatus.outOfStock}>Out of Stock</SelectItem>
                  <SelectItem value={ListingStatus.discontinued}>Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Promo Pricing Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPromo"
                checked={hasPromo}
                onCheckedChange={(checked) => setHasPromo(checked as boolean)}
              />
              <Label htmlFor="hasPromo" className="font-semibold">
                Enable Promotional Pricing
              </Label>
            </div>

            {hasPromo && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                <div className="space-y-2">
                  <Label htmlFor="promoPrice">Promo Price (ZAR) *</Label>
                  <Input
                    id="promoPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    placeholder="0.00"
                    disabled={isLoading}
                  />
                </div>

                {savings !== null && savings > 0 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Customers will save <strong>{formatZAR(BigInt(Math.round(savings * 100)))}</strong> with this
                      promo
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="promoStartDate">Start Date *</Label>
                    <Input
                      id="promoStartDate"
                      type="date"
                      value={promoStartDate}
                      onChange={(e) => setPromoStartDate(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="promoStartTime">Start Time *</Label>
                    <Input
                      id="promoStartTime"
                      type="time"
                      value={promoStartTime}
                      onChange={(e) => setPromoStartTime(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="promoIndefinite"
                    checked={promoIndefinite}
                    onCheckedChange={(checked) => setPromoIndefinite(checked as boolean)}
                  />
                  <Label htmlFor="promoIndefinite">Promo runs indefinitely (no end date)</Label>
                </div>

                {!promoIndefinite && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promoEndDate">End Date *</Label>
                      <Input
                        id="promoEndDate"
                        type="date"
                        value={promoEndDate}
                        onChange={(e) => setPromoEndDate(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promoEndTime">End Time *</Label>
                      <Input
                        id="promoEndTime"
                        type="time"
                        value={promoEndTime}
                        onChange={(e) => setPromoEndTime(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Listing' : 'Create Listing'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
