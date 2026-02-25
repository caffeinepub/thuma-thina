import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WeekdayTimeRange, HolidayOverride } from '@/types/local';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface RetailerHoursEditorProps {
  weeklySchedule: WeekdayTimeRange[];
  holidayOverrides: HolidayOverride[];
  onChange: (schedule: WeekdayTimeRange[], overrides: HolidayOverride[]) => void;
}

function timeCodeToString(code: bigint): string {
  const n = Number(code);
  const hours = Math.floor(n / 100);
  const minutes = n % 100;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function stringToTimeCode(str: string): bigint {
  const [h, m] = str.split(':').map(Number);
  return BigInt(h * 100 + m);
}

export function RetailerHoursEditor({
  weeklySchedule,
  holidayOverrides,
  onChange,
}: RetailerHoursEditorProps) {
  const getDay = (day: number): WeekdayTimeRange | undefined =>
    weeklySchedule.find((d) => Number(d.day) === day);

  const handleDayToggle = (day: number, isOpen: boolean) => {
    const existing = getDay(day);
    let newSchedule: WeekdayTimeRange[];
    if (isOpen) {
      if (existing) {
        newSchedule = weeklySchedule.map((d) =>
          Number(d.day) === day ? { ...d } : d
        );
      } else {
        newSchedule = [
          ...weeklySchedule,
          { day: BigInt(day), openTime: BigInt(800), closeTime: BigInt(1700) },
        ];
      }
    } else {
      newSchedule = weeklySchedule.filter((d) => Number(d.day) !== day);
    }
    onChange(newSchedule, holidayOverrides);
  };

  const handleTimeChange = (
    day: number,
    field: 'openTime' | 'closeTime',
    value: string
  ) => {
    const newSchedule = weeklySchedule.map((d) =>
      Number(d.day) === day ? { ...d, [field]: stringToTimeCode(value) } : d
    );
    onChange(newSchedule, holidayOverrides);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {DAYS.map((dayName, index) => {
            const dayEntry = getDay(index);
            const isOpen = !!dayEntry;
            return (
              <div key={index} className="flex items-center gap-3">
                <Switch
                  checked={isOpen}
                  onCheckedChange={(checked) => handleDayToggle(index, checked)}
                />
                <span className="w-24 text-sm font-medium">{dayName}</span>
                {isOpen && dayEntry && (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={timeCodeToString(dayEntry.openTime)}
                      onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-muted-foreground text-sm">to</span>
                    <Input
                      type="time"
                      value={timeCodeToString(dayEntry.closeTime)}
                      onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                      className="w-32"
                    />
                  </div>
                )}
                {!isOpen && (
                  <span className="text-sm text-muted-foreground">Closed</span>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
