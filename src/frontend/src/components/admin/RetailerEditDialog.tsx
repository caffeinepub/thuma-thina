import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { RetailerHoursEditor, type DaySchedule, type HolidayOverride } from './RetailerHoursEditor';
import { SA_PROVINCES } from '../../utils/saProvinces';
import type { Retailer } from '../../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface RetailerEditDialogProps {
  retailer: Retailer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    id: bigint;
    name: string;
    townSuburb: string;
    province: string;
    weeklyHours: DaySchedule[];
    holidayOverrides: HolidayOverride[];
  }) => Promise<void>;
  isSaving: boolean;
}

const DEFAULT_WEEKLY_HOURS: DaySchedule[] = [
  { day: 'Monday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Friday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '18:00' }
];

export function RetailerEditDialog({
  retailer,
  open,
  onOpenChange,
  onSave,
  isSaving
}: RetailerEditDialogProps) {
  const [name, setName] = useState('');
  const [townSuburb, setTownSuburb] = useState('');
  const [province, setProvince] = useState('');
  const [weeklyHours, setWeeklyHours] = useState<DaySchedule[]>(DEFAULT_WEEKLY_HOURS);
  const [holidayOverrides, setHolidayOverrides] = useState<HolidayOverride[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (retailer) {
      setName(retailer.name);
      setTownSuburb(retailer.townSuburb);
      setProvince(retailer.province);
      // TODO: Load existing hours from retailer when backend supports it
      setWeeklyHours(DEFAULT_WEEKLY_HOURS);
      setHolidayOverrides([]);
    } else {
      setName('');
      setTownSuburb('');
      setProvince('');
      setWeeklyHours(DEFAULT_WEEKLY_HOURS);
      setHolidayOverrides([]);
    }
    setError(null);
  }, [retailer, open]);

  const handleSave = async () => {
    setError(null);

    if (!name.trim() || !townSuburb.trim() || !province) {
      setError('Please fill in all required fields');
      return;
    }

    if (!retailer) return;

    try {
      await onSave({
        id: retailer.id,
        name: name.trim(),
        townSuburb: townSuburb.trim(),
        province,
        weeklyHours,
        holidayOverrides
      });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update retailer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Retailer</DialogTitle>
          <DialogDescription>
            Update retailer information and operating hours
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="hours">Operating Hours</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Retailer Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter retailer name"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-province">Province *</Label>
              <Select value={province} onValueChange={setProvince} disabled={isSaving}>
                <SelectTrigger id="edit-province">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {SA_PROVINCES.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-townSuburb">Town/Suburb *</Label>
              <Input
                id="edit-townSuburb"
                value={townSuburb}
                onChange={(e) => setTownSuburb(e.target.value)}
                placeholder="Enter town or suburb"
                disabled={isSaving}
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
