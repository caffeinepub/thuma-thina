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
import { useCreateRetailer, useUpdateRetailer, type Retailer, type RetailerInput, type OpeningHours } from '@/hooks/useRetailers';
import { SA_PROVINCES } from '@/utils/saProvinces';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface RetailerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retailer?: Retailer | null;
}

const defaultOpeningHours: OpeningHours = {
  weeklySchedule: [
    { day: 1, openTime: 800, closeTime: 1700 },
    { day: 2, openTime: 800, closeTime: 1700 },
    { day: 3, openTime: 800, closeTime: 1700 },
    { day: 4, openTime: 800, closeTime: 1700 },
    { day: 5, openTime: 800, closeTime: 1700 },
    { day: 6, openTime: 900, closeTime: 1400 },
  ],
  holidayOverrides: [],
};

export function RetailerEditDialog({ open, onOpenChange, retailer }: RetailerEditDialogProps) {
  const createRetailer = useCreateRetailer();
  const updateRetailer = useUpdateRetailer();

  const [name, setName] = useState('');
  const [townSuburb, setTownSuburb] = useState('');
  const [province, setProvince] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const isEditing = !!retailer;
  const isPending = createRetailer.isPending || updateRetailer.isPending;

  useEffect(() => {
    if (open) {
      if (retailer) {
        setName(retailer.name);
        setTownSuburb(retailer.townSuburb);
        setProvince(retailer.province);
        setAddress(retailer.address);
        setPhone(retailer.phone);
        setEmail(retailer.email);
      } else {
        setName('');
        setTownSuburb('');
        setProvince('');
        setAddress('');
        setPhone('');
        setEmail('');
      }
    }
  }, [open, retailer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Retailer name is required');
      return;
    }
    if (!province) {
      toast.error('Province is required');
      return;
    }

    const input: RetailerInput = {
      name: name.trim(),
      townSuburb: townSuburb.trim(),
      province,
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      openingHours: retailer?.openingHours ?? defaultOpeningHours,
    };

    try {
      if (isEditing && retailer) {
        await updateRetailer.mutateAsync({ id: retailer.id, input });
        toast.success('Retailer updated successfully');
      } else {
        await createRetailer.mutateAsync(input);
        toast.success('Retailer created successfully');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(isEditing ? 'Failed to update retailer' : 'Failed to create retailer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Retailer' : 'Add New Retailer'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="retailer-name">Retailer Name *</Label>
            <Input
              id="retailer-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Thuma Fresh Market"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retailer-province">Province *</Label>
              <Select value={province} onValueChange={setProvince} disabled={isPending}>
                <SelectTrigger id="retailer-province">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {SA_PROVINCES.map(p => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retailer-town">Town / Suburb</Label>
              <Input
                id="retailer-town"
                value={townSuburb}
                onChange={e => setTownSuburb(e.target.value)}
                placeholder="e.g. Osizweni"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="retailer-address">Address</Label>
            <Input
              id="retailer-address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Street address"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retailer-phone">Phone</Label>
              <Input
                id="retailer-phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+27 xx xxx xxxx"
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retailer-email">Email</Label>
              <Input
                id="retailer-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="info@retailer.co.za"
                disabled={isPending}
              />
            </div>
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
              {isEditing ? 'Update Retailer' : 'Create Retailer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RetailerEditDialog;
