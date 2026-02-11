import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import type { WeekdayTimeRange, HolidayOverride } from '@/backend';

interface RetailerHoursEditorProps {
  weeklyHours: WeekdayTimeRange[];
  onWeeklyHoursChange: (hours: WeekdayTimeRange[]) => void;
  holidayOverrides: HolidayOverride[];
  onHolidayOverridesChange: (overrides: HolidayOverride[]) => void;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function RetailerHoursEditor({
  weeklyHours,
  onWeeklyHoursChange,
  holidayOverrides,
  onHolidayOverridesChange,
}: RetailerHoursEditorProps) {
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');

  const getWeekdayHours = (day: number): WeekdayTimeRange | undefined => {
    return weeklyHours.find((h) => Number(h.day) === day);
  };

  const toggleWeekday = (day: number, enabled: boolean) => {
    if (enabled) {
      const newHours: WeekdayTimeRange = {
        day: BigInt(day),
        openTime: BigInt(900), // 9:00 AM
        closeTime: BigInt(1700), // 5:00 PM
      };
      onWeeklyHoursChange([...weeklyHours, newHours]);
    } else {
      onWeeklyHoursChange(weeklyHours.filter((h) => Number(h.day) !== day));
    }
  };

  const updateWeekdayTime = (day: number, field: 'openTime' | 'closeTime', value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    const timeCode = hours * 100 + minutes;

    const updated = weeklyHours.map((h) =>
      Number(h.day) === day ? { ...h, [field]: BigInt(timeCode) } : h
    );
    onWeeklyHoursChange(updated);
  };

  const formatTimeCode = (code: bigint): string => {
    const num = Number(code);
    const hours = Math.floor(num / 100);
    const minutes = num % 100;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const addHolidayOverride = () => {
    if (!newHolidayDate || !newHolidayName) return;

    const dateMs = new Date(newHolidayDate).getTime();
    const dateNs = BigInt(dateMs) * BigInt(1_000_000);

    const newOverride: HolidayOverride = {
      date: dateNs,
      name: newHolidayName,
      isOpen: false,
      openTime: undefined,
      closeTime: undefined,
    };

    onHolidayOverridesChange([...holidayOverrides, newOverride]);
    setNewHolidayDate('');
    setNewHolidayName('');
  };

  const removeHolidayOverride = (index: number) => {
    onHolidayOverridesChange(holidayOverrides.filter((_, i) => i !== index));
  };

  const toggleHolidayOpen = (index: number, isOpen: boolean) => {
    const updated = [...holidayOverrides];
    updated[index] = {
      ...updated[index],
      isOpen,
      openTime: isOpen ? BigInt(900) : undefined,
      closeTime: isOpen ? BigInt(1700) : undefined,
    };
    onHolidayOverridesChange(updated);
  };

  const updateHolidayTime = (index: number, field: 'openTime' | 'closeTime', value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    const timeCode = hours * 100 + minutes;

    const updated = [...holidayOverrides];
    updated[index] = { ...updated[index], [field]: BigInt(timeCode) };
    onHolidayOverridesChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Set regular opening hours for each day of the week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {WEEKDAYS.map((dayName, index) => {
            const dayHours = getWeekdayHours(index);
            const isOpen = !!dayHours;

            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32">
                  <Label>{dayName}</Label>
                </div>
                <Switch checked={isOpen} onCheckedChange={(checked) => toggleWeekday(index, checked)} />
                {isOpen && dayHours && (
                  <>
                    <Input
                      type="time"
                      value={formatTimeCode(dayHours.openTime)}
                      onChange={(e) => updateWeekdayTime(index, 'openTime', e.target.value)}
                      className="w-32"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={formatTimeCode(dayHours.closeTime)}
                      onChange={(e) => updateWeekdayTime(index, 'closeTime', e.target.value)}
                      className="w-32"
                    />
                  </>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Holiday Overrides */}
      <Card>
        <CardHeader>
          <CardTitle>Holiday Overrides</CardTitle>
          <CardDescription>Set special hours for holidays and special dates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {holidayOverrides.map((override, index) => {
            const dateMs = Number(override.date / BigInt(1_000_000));
            const dateStr = new Date(dateMs).toLocaleDateString();

            return (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{override.name}</div>
                  <div className="text-sm text-muted-foreground">{dateStr}</div>
                </div>
                <Switch
                  checked={override.isOpen}
                  onCheckedChange={(checked) => toggleHolidayOpen(index, checked)}
                />
                {override.isOpen && override.openTime !== undefined && override.closeTime !== undefined && (
                  <>
                    <Input
                      type="time"
                      value={formatTimeCode(override.openTime)}
                      onChange={(e) => updateHolidayTime(index, 'openTime', e.target.value)}
                      className="w-32"
                    />
                    <span>to</span>
                    <Input
                      type="time"
                      value={formatTimeCode(override.closeTime)}
                      onChange={(e) => updateHolidayTime(index, 'closeTime', e.target.value)}
                      className="w-32"
                    />
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeHolidayOverride(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          <div className="flex gap-2">
            <Input
              type="date"
              value={newHolidayDate}
              onChange={(e) => setNewHolidayDate(e.target.value)}
              placeholder="Date"
            />
            <Input
              value={newHolidayName}
              onChange={(e) => setNewHolidayName(e.target.value)}
              placeholder="Holiday name"
            />
            <Button onClick={addHolidayOverride} disabled={!newHolidayDate || !newHolidayName}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
