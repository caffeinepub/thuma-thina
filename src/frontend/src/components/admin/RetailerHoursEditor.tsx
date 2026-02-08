import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Calendar } from 'lucide-react';

export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface HolidayOverride {
  date: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  description: string;
}

interface RetailerHoursEditorProps {
  weeklyHours: DaySchedule[];
  holidayOverrides: HolidayOverride[];
  onWeeklyHoursChange: (hours: DaySchedule[]) => void;
  onHolidayOverridesChange: (overrides: HolidayOverride[]) => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export function RetailerHoursEditor({
  weeklyHours,
  holidayOverrides,
  onWeeklyHoursChange,
  onHolidayOverridesChange
}: RetailerHoursEditorProps) {
  const updateDaySchedule = (index: number, updates: Partial<DaySchedule>) => {
    const newHours = [...weeklyHours];
    newHours[index] = { ...newHours[index], ...updates };
    onWeeklyHoursChange(newHours);
  };

  const addHolidayOverride = () => {
    const newOverride: HolidayOverride = {
      date: '',
      isOpen: false,
      openTime: '08:00',
      closeTime: '20:00',
      description: ''
    };
    onHolidayOverridesChange([...holidayOverrides, newOverride]);
  };

  const updateHolidayOverride = (index: number, updates: Partial<HolidayOverride>) => {
    const newOverrides = [...holidayOverrides];
    newOverrides[index] = { ...newOverrides[index], ...updates };
    onHolidayOverridesChange(newOverrides);
  };

  const removeHolidayOverride = (index: number) => {
    const newOverrides = holidayOverrides.filter((_, i) => i !== index);
    onHolidayOverridesChange(newOverrides);
  };

  return (
    <div className="space-y-6">
      {/* Weekly Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Operating Hours</CardTitle>
          <CardDescription>Set opening and closing times for each day of the week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyHours.map((schedule, index) => (
            <div key={schedule.day} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">{schedule.day}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {schedule.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <Switch
                    checked={schedule.isOpen}
                    onCheckedChange={(checked) =>
                      updateDaySchedule(index, { isOpen: checked })
                    }
                  />
                </div>
              </div>
              {schedule.isOpen && (
                <div className="grid grid-cols-2 gap-3 pl-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Opening Time</Label>
                    <Input
                      type="time"
                      value={schedule.openTime}
                      onChange={(e) =>
                        updateDaySchedule(index, { openTime: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Closing Time</Label>
                    <Input
                      type="time"
                      value={schedule.closeTime}
                      onChange={(e) =>
                        updateDaySchedule(index, { closeTime: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
              {index < weeklyHours.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Holiday Overrides */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Holiday Overrides</CardTitle>
              <CardDescription>Set special hours for holidays and special dates</CardDescription>
            </div>
            <Button onClick={addHolidayOverride} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Holiday
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {holidayOverrides.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No holiday overrides set</p>
            </div>
          ) : (
            holidayOverrides.map((override, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Date</Label>
                          <Input
                            type="date"
                            value={override.date}
                            onChange={(e) =>
                              updateHolidayOverride(index, { date: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Description</Label>
                          <Input
                            type="text"
                            placeholder="e.g., Christmas Day"
                            value={override.description}
                            onChange={(e) =>
                              updateHolidayOverride(index, { description: e.target.value })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {override.isOpen ? 'Open' : 'Closed'}
                        </span>
                        <Switch
                          checked={override.isOpen}
                          onCheckedChange={(checked) =>
                            updateHolidayOverride(index, { isOpen: checked })
                          }
                        />
                      </div>
                      {override.isOpen && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm text-muted-foreground">Opening Time</Label>
                            <Input
                              type="time"
                              value={override.openTime}
                              onChange={(e) =>
                                updateHolidayOverride(index, { openTime: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-muted-foreground">Closing Time</Label>
                            <Input
                              type="time"
                              value={override.closeTime}
                              onChange={(e) =>
                                updateHolidayOverride(index, { closeTime: e.target.value })
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHolidayOverride(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
