import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAllRetailers, useAddRetailer, useUpdateRetailer, useRemoveRetailer } from '../../hooks/useQueries';
import { ChevronLeft, Store, Loader2, AlertCircle, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { SA_PROVINCES } from '../../utils/saProvinces';
import { RetailerEditDialog } from '../../components/admin/RetailerEditDialog';
import type { Retailer } from '../../backend';
import type { DaySchedule, HolidayOverride } from '../../components/admin/RetailerHoursEditor';

const DEFAULT_WEEKLY_HOURS: DaySchedule[] = [
  { day: 'Monday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Tuesday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Wednesday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Thursday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Friday', isOpen: true, openTime: '08:00', closeTime: '20:00' },
  { day: 'Saturday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
  { day: 'Sunday', isOpen: true, openTime: '09:00', closeTime: '18:00' }
];

export function AdminRetailersPage() {
  const navigate = useNavigate();
  const { data: allRetailers, isLoading } = useAllRetailers();
  const addRetailer = useAddRetailer();
  const updateRetailer = useUpdateRetailer();
  const removeRetailer = useRemoveRetailer();

  // Registration form state
  const [name, setName] = useState('');
  const [townSuburb, setTownSuburb] = useState('');
  const [province, setProvince] = useState('');

  // Edit dialog state
  const [editingRetailer, setEditingRetailer] = useState<Retailer | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Delete confirmation state
  const [deletingRetailer, setDeletingRetailer] = useState<Retailer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAddRetailer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim() || !townSuburb.trim() || !province) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await addRetailer.mutateAsync({
        name: name.trim(),
        townSuburb: townSuburb.trim(),
        province
      });
      setSuccess('Retailer registered successfully!');
      setName('');
      setTownSuburb('');
      setProvince('');
    } catch (err: any) {
      setError(err.message || 'Failed to register retailer');
    }
  };

  const handleEditRetailer = async (data: {
    id: bigint;
    name: string;
    townSuburb: string;
    province: string;
    weeklyHours: DaySchedule[];
    holidayOverrides: HolidayOverride[];
  }) => {
    await updateRetailer.mutateAsync(data);
    setSuccess('Retailer updated successfully!');
  };

  const handleDeleteRetailer = async () => {
    if (!deletingRetailer) return;

    setError(null);
    setSuccess(null);

    try {
      await removeRetailer.mutateAsync(deletingRetailer.id);
      setSuccess('Retailer removed successfully!');
      setDeleteDialogOpen(false);
      setDeletingRetailer(null);
    } catch (err: any) {
      setError(err.message || 'Failed to remove retailer');
      setDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (retailer: Retailer) => {
    setEditingRetailer(retailer);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (retailer: Retailer) => {
    setDeletingRetailer(retailer);
    setDeleteDialogOpen(true);
  };

  // Extract unique retailers from RetailerWithListings
  const retailers = allRetailers?.map(rwl => rwl.retailer) || [];

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate({ to: '/admin' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Admin Dashboard
        </button>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Retailers Management</h1>
        <p className="text-muted-foreground">Register new retailers and manage existing ones</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <AlertDescription className="text-primary">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Register New Retailer
            </CardTitle>
            <CardDescription>Add a new retailer to the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRetailer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Retailer Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter retailer name"
                  disabled={addRetailer.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Select value={province} onValueChange={setProvince} disabled={addRetailer.isPending}>
                  <SelectTrigger id="province">
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
                <Label htmlFor="townSuburb">Town/Suburb *</Label>
                <Input
                  id="townSuburb"
                  value={townSuburb}
                  onChange={(e) => setTownSuburb(e.target.value)}
                  placeholder="Enter town or suburb"
                  disabled={addRetailer.isPending}
                />
              </div>

              <Button type="submit" className="w-full" disabled={addRetailer.isPending}>
                {addRetailer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Retailer
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-accent" />
              Retailers Overview
            </CardTitle>
            <CardDescription>Current platform statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border bg-card">
                <div>
                  <p className="text-sm text-muted-foreground">Total Retailers</p>
                  <p className="text-3xl font-bold text-foreground">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : retailers.length}
                  </p>
                </div>
                <Store className="h-12 w-12 text-accent/30" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border-2 border-border bg-card">
                <div>
                  <p className="text-sm text-muted-foreground">Provinces Covered</p>
                  <p className="text-3xl font-bold text-foreground">
                    {isLoading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      new Set(retailers.map(r => r.province)).size
                    )}
                  </p>
                </div>
                <MapPin className="h-12 w-12 text-primary/30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retailers List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Retailers</CardTitle>
          <CardDescription>Manage existing retailers and their operating hours</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && retailers.length === 0 && (
            <div className="text-center py-12">
              <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No retailers registered yet</p>
            </div>
          )}

          {!isLoading && retailers.length > 0 && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Town/Suburb</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retailers.map((retailer) => (
                    <TableRow key={retailer.id.toString()}>
                      <TableCell className="font-medium">{retailer.name}</TableCell>
                      <TableCell>{retailer.province}</TableCell>
                      <TableCell>{retailer.townSuburb}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(retailer)}
                            disabled={updateRetailer.isPending}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(retailer)}
                            disabled={removeRetailer.isPending}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <RetailerEditDialog
        retailer={editingRetailer}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleEditRetailer}
        isSaving={updateRetailer.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Retailer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{deletingRetailer?.name}</strong>? This action cannot be undone and will remove all associated listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRetailer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeRetailer.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Retailer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
