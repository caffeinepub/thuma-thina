import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useListTowns, useCreateTown, useUpdateTown, useRemoveTown } from '@/hooks/useTowns';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { SA_PROVINCES } from '@/utils/saProvinces';
import { toast } from 'sonner';
import { navigate } from '@/router/HashRouter';
import type { Town, TownId } from '@/backend';
import { TownStatus } from '@/backend';

export function AdminTownsPage() {
  const { data: towns, isLoading } = useListTowns();
  const createTown = useCreateTown();
  const updateTown = useUpdateTown();
  const removeTown = useRemoveTown();

  const [activeTab, setActiveTab] = useState<'active' | 'removed'>('active');
  const [editingTown, setEditingTown] = useState<Town | null>(null);
  const [deleteTownId, setDeleteTownId] = useState<TownId | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [province, setProvince] = useState('');

  const activeTowns = towns?.filter((t) => t.status === TownStatus.active) || [];
  const removedTowns = towns?.filter((t) => t.status === TownStatus.removed) || [];
  const displayTowns = activeTab === 'active' ? activeTowns : removedTowns;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Town name is required');
      return;
    }

    if (!province) {
      toast.error('Province is required');
      return;
    }

    try {
      if (editingTown) {
        await updateTown.mutateAsync({
          id: editingTown.id,
          name: name.trim(),
          province,
        });
        toast.success('Town updated successfully');
      } else {
        await createTown.mutateAsync({
          name: name.trim(),
          province,
        });
        toast.success('Town created successfully');
      }

      // Reset form
      setName('');
      setProvince('');
      setEditingTown(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save town');
    }
  };

  const handleEdit = (town: Town) => {
    setEditingTown(town);
    setName(town.name);
    setProvince(town.province);
  };

  const handleCancelEdit = () => {
    setEditingTown(null);
    setName('');
    setProvince('');
  };

  const handleDeleteClick = (townId: TownId) => {
    setDeleteTownId(townId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTownId) return;

    try {
      await removeTown.mutateAsync(deleteTownId);
      toast.success('Town removed successfully');
      setDeleteTownId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove town');
    }
  };

  const provinceOptions = SA_PROVINCES.map((p) => ({
    value: p,
    label: p,
  }));

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Towns Management</h1>
            <p className="text-muted-foreground">Manage the list of towns where Thuma Thina operates</p>
          </div>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Towns</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{towns?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Towns</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTowns.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Removed Towns</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{removedTowns.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingTown ? 'Edit Town' : 'Add New Town'}</CardTitle>
            <CardDescription>
              {editingTown ? 'Update town information' : 'Add a new town to the system'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Town Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Osizweni"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={createTown.isPending || updateTown.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province *</Label>
                  <SearchableSelect
                    options={provinceOptions}
                    value={province}
                    onValueChange={setProvince}
                    placeholder="Select province"
                    disabled={createTown.isPending || updateTown.isPending}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createTown.isPending || updateTown.isPending}
                >
                  {editingTown ? (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      {updateTown.isPending ? 'Updating...' : 'Update Town'}
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      {createTown.isPending ? 'Creating...' : 'Create Town'}
                    </>
                  )}
                </Button>

                {editingTown && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={createTown.isPending || updateTown.isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Towns List */}
        <Card>
          <CardHeader>
            <CardTitle>Towns List</CardTitle>
            <CardDescription>View and manage all towns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'removed')}>
              <TabsList>
                <TabsTrigger value="active">Active ({activeTowns.length})</TabsTrigger>
                <TabsTrigger value="removed">Removed ({removedTowns.length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading towns...</div>
                ) : displayTowns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {activeTab} towns found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Province</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayTowns.map((town) => (
                        <TableRow key={town.id.toString()}>
                          <TableCell className="font-medium">{town.name}</TableCell>
                          <TableCell>{town.province}</TableCell>
                          <TableCell>
                            <Badge variant={town.status === TownStatus.active ? 'default' : 'secondary'}>
                              {town.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {town.status === TownStatus.active && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEdit(town)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteClick(town.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTownId} onOpenChange={() => setDeleteTownId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Town</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this town? This action will soft-delete the town and it will no
              longer be available for new memberships.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
