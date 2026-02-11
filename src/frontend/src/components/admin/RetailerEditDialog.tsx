import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useCreateRetailer, useUpdateRetailer } from '@/hooks/useRetailers';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { RetailerHoursEditor } from '@/components/admin/RetailerHoursEditor';
import { SA_PROVINCES } from '@/utils/saProvinces';
import type { Retailer, RetailerInput, WeekdayTimeRange, HolidayOverride } from '@/backend';
import { toast } from 'sonner';

interface RetailerEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retailer?: Retailer | null;
}

export function RetailerEditDialog({ open, onOpenChange, retailer }: RetailerEditDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [townSuburb, setTownSuburb] = useState('');
  const [weeklyHours, setWeeklyHours] = useState<WeekdayTimeRange[]>([]);
  const [holidayOverrides, setHolidayOverrides] = useState<HolidayOverride[]>([]);

  const createRetailer = useCreateRetailer();
  const updateRetailer = useUpdateRetailer();

  const isEditing = !!retailer;
  const isLoading = createRetailer.isPending || updateRetailer.isPending;

  useEffect(() => {
    if (retailer) {
      setName(retailer.name);
      setEmail(retailer.email);
      setPhone(retailer.phone);
      setAddress(retailer.address);
      setProvince(retailer.province);
      setTownSuburb(retailer.townSuburb);
      setWeeklyHours(retailer.openingHours.weeklySchedule);
      setHolidayOverrides(retailer.openingHours.holidayOverrides);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setProvince('');
      setTownSuburb('');
      setWeeklyHours([]);
      setHolidayOverrides([]);
    }
  }, [retailer, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Retailer name is required');
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!phone.trim()) {
      toast.error('Phone is required');
      return;
    }

    if (!address.trim()) {
      toast.error('Address is required');
      return;
    }

    if (!province) {
      toast.error('Province is required');
      return;
    }

    if (!townSuburb.trim()) {
      toast.error('Town/Suburb is required');
      return;
    }

    try {
      const input: RetailerInput = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        province,
        townSuburb: townSuburb.trim(),
        openingHours: {
          weeklySchedule: weeklyHours,
          holidayOverrides,
        },
      };

      if (isEditing && retailer) {
        await updateRetailer.mutateAsync({ id: retailer.id, input });
        toast.success('Retailer updated successfully');
      } else {
        await createRetailer.mutateAsync(input);
        toast.success('Retailer created successfully');
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save retailer');
    }
  };

  const provinceOptions = SA_PROVINCES.map((p) => ({
    value: p,
    label: p,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Retailer' : 'Create Retailer'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="hours">Opening Hours</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Retailer Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter retailer name"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 XX XXX XXXX"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <SearchableSelect
                    options={provinceOptions}
                    value={province}
                    onValueChange={setProvince}
                    placeholder="Select province"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="townSuburb">Town/Suburb *</Label>
                  <Input
                    id="townSuburb"
                    value={townSuburb}
                    onChange={(e) => setTownSuburb(e.target.value)}
                    placeholder="Enter town or suburb"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-4">
              <RetailerHoursEditor
                weeklyHours={weeklyHours}
                onWeeklyHoursChange={setWeeklyHours}
                holidayOverrides={holidayOverrides}
                onHolidayOverridesChange={setHolidayOverrides}
              />
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Retailer' : 'Create Retailer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
