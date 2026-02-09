import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Store, Clock } from 'lucide-react';
import { useUpdateRetailer } from '../../hooks/useQueries';
import { SA_PROVINCES } from '../../utils/saProvinces';
import { RetailerHoursEditor, type DaySchedule, type HolidayOverride } from './RetailerHoursEditor';
import type { Retailer, RetailerInput } from '../../backend';

interface RetailerEditDialogProps {
  retailer: Retailer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function convertBackendToUIHours(retailer: Retailer): DaySchedule[] {
  const weeklyHours: DaySchedule[] = DAYS_OF_WEEK.map(day => ({
    day,
    isOpen: false,
    openTime: '08:00',
    closeTime: '20:00'
  }));

  if (retailer.openingHours?.weeklySchedule) {
    for (const schedule of retailer.openingHours.weeklySchedule) {
      const dayIndex = Number(schedule.day);
      if (dayIndex >= 0 && dayIndex < 7) {
        const openTimeStr = schedule.openTime.toString().padStart(4, '0');
        const closeTimeStr = schedule.closeTime.toString().padStart(4, '0');
        weeklyHours[dayIndex] = {
          day: DAYS_OF_WEEK[dayIndex],
          isOpen: true,
          openTime: `${openTimeStr.slice(0, 2)}:${openTimeStr.slice(2)}`,
          closeTime: `${closeTimeStr.slice(0, 2)}:${closeTimeStr.slice(2)}`
        };
      }
    }
  }

  return weeklyHours;
}

function convertBackendToUIHolidays(retailer: Retailer): HolidayOverride[] {
  if (!retailer.openingHours?.holidayOverrides) return [];

  return retailer.openingHours.holidayOverrides.map(override => {
    const dateMs = Number(override.date) / 1000000; // Convert from nanoseconds
    const date = new Date(dateMs);
    const dateStr = date.toISOString().split('T')[0];

    const openTimeStr = override.openTime ? override.openTime.toString().padStart(4, '0') : '0800';
    const closeTimeStr = override.closeTime ? override.closeTime.toString().padStart(4, '0') : '2000';

    return {
      date: dateStr,
      isOpen: override.isOpen,
      openTime: `${openTimeStr.slice(0, 2)}:${openTimeStr.slice(2)}`,
      closeTime: `${closeTimeStr.slice(0, 2)}:${closeTimeStr.slice(2)}`,
      description: override.name
    };
  });
}

export function RetailerEditDialog({ retailer, open, onOpenChange, onSuccess, onError }: RetailerEditDialogProps) {
  const updateRetailer = useUpdateRetailer();

  const [formData, setFormData] = useState({
    name: retailer.name,
    email: retailer.email,
    phone: retailer.phone,
    address: retailer.address,
    province: retailer.province,
    townSuburb: retailer.townSuburb
  });

  const [weeklyHours, setWeeklyHours] = useState<DaySchedule[]>(() => convertBackendToUIHours(retailer));
  const [holidayOverrides, setHolidayOverrides] = useState<HolidayOverride[]>(() => convertBackendToUIHolidays(retailer));
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        name: retailer.name,
        email: retailer.email,
        phone: retailer.phone,
        address: retailer.address,
        province: retailer.province,
        townSuburb: retailer.townSuburb
      });
      setWeeklyHours(convertBackendToUIHours(retailer));
      setHolidayOverrides(convertBackendToUIHolidays(retailer));
      setLocalError(null);
    }
  }, [open, retailer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.province || !formData.townSuburb) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      // Convert UI hours format to backend format
      const weeklySchedule = weeklyHours
        .filter(day => day.isOpen)
        .map(day => {
          const dayIndex = DAYS_OF_WEEK.indexOf(day.day);
          const openTime = parseInt(day.openTime.replace(':', ''));
          const closeTime = parseInt(day.closeTime.replace(':', ''));
          return {
            day: BigInt(dayIndex),
            openTime: BigInt(openTime),
            closeTime: BigInt(closeTime)
          };
        });

      const holidayOverridesBackend = holidayOverrides.map(override => {
        const dateTimestamp = new Date(override.date).getTime() * 1000000; // Convert to nanoseconds
        return {
          date: BigInt(dateTimestamp),
          isOpen: override.isOpen,
          openTime: override.isOpen ? BigInt(parseInt(override.openTime.replace(':', ''))) : undefined,
          closeTime: override.isOpen ? BigInt(parseInt(override.closeTime.replace(':', ''))) : undefined,
          name: override.description
        };
      });

      const input: RetailerInput = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        province: formData.province,
        townSuburb: formData.townSuburb,
        openingHours: {
          weeklySchedule,
          holidayOverrides: holidayOverridesBackend
        }
      };

      await updateRetailer.mutateAsync({ id: retailer.id, input });
      onSuccess();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update retailer';
      setLocalError(errorMsg);
      onError(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Edit Retailer
          </DialogTitle>
          <DialogDescription>Update retailer information and operating hours</DialogDescription>
        </DialogHeader>

        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">
                <Store className="h-4 w-4 mr-2" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="hours">
                <Clock className="h-4 w-4 mr-2" />
                Operating Hours
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="edit-name">Retailer Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-phone">Phone *</Label>
                <Input
                  id="edit-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-address">Physical Address *</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-province">Province *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(value) => setFormData({ ...formData, province: value })}
                >
                  <SelectTrigger id="edit-province">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {SA_PROVINCES.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-townSuburb">Town/Suburb *</Label>
                <Input
                  id="edit-townSuburb"
                  value={formData.townSuburb}
                  onChange={(e) => setFormData({ ...formData, townSuburb: e.target.value })}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-4">
              <RetailerHoursEditor
                weeklyHours={weeklyHours}
                holidayOverrides={holidayOverrides}
                onWeeklyHoursChange={setWeeklyHours}
                onHolidayOverridesChange={setHolidayOverrides}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateRetailer.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateRetailer.isPending}>
              {updateRetailer.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
