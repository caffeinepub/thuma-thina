import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAddRetailer, useAllRetailers, useRemoveRetailer } from '../../hooks/useQueries';
import { Store, AlertCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import type { Retailer, RetailerInput } from '../../backend';
import { SA_PROVINCES } from '../../utils/saProvinces';
import { RetailerHoursEditor, type DaySchedule, type HolidayOverride } from '../../components/admin/RetailerHoursEditor';
import { RetailerEditDialog } from '../../components/admin/RetailerEditDialog';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AdminRetailersPage() {
  const { data: allRetailers, isLoading } = useAllRetailers();
  const addRetailerMutation = useAddRetailer();
  const removeRetailerMutation = useRemoveRetailer();

  // Form state
  const [name, setName] = useState('');
  const [townSuburb, setTownSuburb] = useState('');
  const [province, setProvince] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Initialize weekly hours with default closed state
  const [weeklyHours, setWeeklyHours] = useState<DaySchedule[]>(
    DAYS_OF_WEEK.map(day => ({
      day,
      isOpen: false,
      openTime: '08:00',
      closeTime: '20:00'
    }))
  );
  const [holidayOverrides, setHolidayOverrides] = useState<HolidayOverride[]>([]);

  // Edit/Delete state
  const [editingRetailer, setEditingRetailer] = useState<Retailer | null>(null);
  const [deletingRetailer, setDeletingRetailer] = useState<Retailer | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      await addRetailerMutation.mutateAsync({
        name,
        townSuburb,
        province,
        address,
        phone,
        email,
        openingHours: {
          weeklySchedule,
          holidayOverrides: holidayOverridesBackend
        }
      });
      
      // Reset form
      setName('');
      setTownSuburb('');
      setProvince('');
      setAddress('');
      setPhone('');
      setEmail('');
      setWeeklyHours(
        DAYS_OF_WEEK.map(day => ({
          day,
          isOpen: false,
          openTime: '08:00',
          closeTime: '20:00'
        }))
      );
      setHolidayOverrides([]);
    } catch (error: any) {
      console.error('Error adding retailer:', error);
    }
  };

  const handleDelete = async () => {
    if (!deletingRetailer) return;
    
    try {
      await removeRetailerMutation.mutateAsync(deletingRetailer.id);
      setDeletingRetailer(null);
    } catch (error: any) {
      console.error('Error deleting retailer:', error);
    }
  };

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Retailer Management
          </h1>
          <p className="text-muted-foreground">
            Register and manage retailers in the system
          </p>
        </div>

        {/* Registration Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Register New Retailer
            </CardTitle>
            <CardDescription>
              Add a new retailer with operating hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Retailer Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Pick n Pay"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="townSuburb">Town/Suburb</Label>
                  <Input
                    id="townSuburb"
                    value={townSuburb}
                    onChange={(e) => setTownSuburb(e.target.value)}
                    placeholder="e.g., Sandton"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <select
                    id="province"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border-2 border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select province...</option>
                    {SA_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g., +27 11 123 4567"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., store@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., 123 Main Street"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Operating Hours</Label>
                <RetailerHoursEditor
                  weeklyHours={weeklyHours}
                  holidayOverrides={holidayOverrides}
                  onWeeklyHoursChange={setWeeklyHours}
                  onHolidayOverridesChange={setHolidayOverrides}
                />
              </div>

              {addRetailerMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {addRetailerMutation.error?.message || 'Failed to add retailer'}
                  </AlertDescription>
                </Alert>
              )}
              {addRetailerMutation.isSuccess && (
                <Alert className="border-green-500 text-green-700 bg-green-50">
                  <AlertDescription>Retailer registered successfully!</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={addRetailerMutation.isPending}
                className="w-full sm:w-auto"
              >
                {addRetailerMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Retailer'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Retailers List */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Registered Retailers</CardTitle>
            <CardDescription>
              View and manage all retailers in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !allRetailers || allRetailers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No retailers registered yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allRetailers.map((retailer) => (
                    <TableRow key={retailer.id.toString()}>
                      <TableCell className="font-medium">{retailer.name}</TableCell>
                      <TableCell>
                        {retailer.townSuburb}, {retailer.province}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{retailer.phone}</div>
                          <div className="text-muted-foreground">{retailer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRetailer(retailer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingRetailer(retailer)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Retailer</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{deletingRetailer?.name}"? This will also remove all associated listings. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeletingRetailer(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {removeRetailerMutation.isPending ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Deleting...
                                    </>
                                  ) : (
                                    'Delete'
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      {editingRetailer && (
        <RetailerEditDialog
          retailer={editingRetailer}
          open={!!editingRetailer}
          onOpenChange={(open) => !open && setEditingRetailer(null)}
          onSuccess={() => setEditingRetailer(null)}
          onError={(error) => console.error('Edit error:', error)}
        />
      )}
    </div>
  );
}
