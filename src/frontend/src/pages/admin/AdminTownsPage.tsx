import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { useListTowns, useCreateTown, useUpdateTown, useRemoveTown } from '@/hooks/useTowns';
import { SA_PROVINCES } from '@/utils/saProvinces';
import { Plus, Edit, Trash2, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Town, TownId } from '@/backend';
import { TownStatus } from '@/backend';

export function AdminTownsPage() {
  const { data: towns, isLoading } = useListTowns();
  const createTown = useCreateTown();
  const updateTown = useUpdateTown();
  const removeTown = useRemoveTown();

  const [showRemoved, setShowRemoved] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [townToRemove, setTownToRemove] = useState<Town | null>(null);
  const [editingTown, setEditingTown] = useState<Town | null>(null);

  const [newTownName, setNewTownName] = useState('');
  const [newTownProvince, setNewTownProvince] = useState('');
  const [editTownName, setEditTownName] = useState('');
  const [editTownProvince, setEditTownProvince] = useState('');

  const provinceOptions = SA_PROVINCES.map((province) => ({
    value: province,
    label: province,
  }));

  const filteredTowns = towns?.filter((town) =>
    showRemoved ? true : town.status === TownStatus.active
  ) || [];

  const activeTownsCount = towns?.filter((t) => t.status === TownStatus.active).length || 0;
  const removedTownsCount = towns?.filter((t) => t.status === TownStatus.removed).length || 0;

  const handleCreateTown = async () => {
    if (!newTownName.trim()) {
      toast.error('Town name is required');
      return;
    }
    if (!newTownProvince) {
      toast.error('Province is required');
      return;
    }

    try {
      await createTown.mutateAsync({
        name: newTownName.trim(),
        province: newTownProvince,
      });
      toast.success('Town created successfully');
      setIsCreateDialogOpen(false);
      setNewTownName('');
      setNewTownProvince('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create town');
    }
  };

  const handleEditTown = async () => {
    if (!editingTown) return;
    if (!editTownName.trim()) {
      toast.error('Town name is required');
      return;
    }
    if (!editTownProvince) {
      toast.error('Province is required');
      return;
    }

    try {
      await updateTown.mutateAsync({
        id: editingTown.id,
        name: editTownName.trim(),
        province: editTownProvince,
      });
      toast.success('Town updated successfully');
      setIsEditDialogOpen(false);
      setEditingTown(null);
      setEditTownName('');
      setEditTownProvince('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update town');
    }
  };

  const handleRemoveTown = async () => {
    if (!townToRemove) return;

    try {
      await removeTown.mutateAsync(townToRemove.id);
      toast.success('Town removed successfully');
      setTownToRemove(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove town');
    }
  };

  const openEditDialog = (town: Town) => {
    setEditingTown(town);
    setEditTownName(town.name);
    setEditTownProvince(town.province);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Towns Management</h1>
            <p className="text-muted-foreground">
              Manage the list of towns where Thuma Thina operates
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Town
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Town</DialogTitle>
                <DialogDescription>
                  Add a new town to the list of available service areas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="town-name">Town Name</Label>
                  <Input
                    id="town-name"
                    placeholder="e.g., Johannesburg"
                    value={newTownName}
                    onChange={(e) => setNewTownName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="town-province">Province</Label>
                  <SearchableSelect
                    options={provinceOptions}
                    value={newTownProvince}
                    onValueChange={setNewTownProvince}
                    placeholder="Select province"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setNewTownName('');
                    setNewTownProvince('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTown}
                  disabled={createTown.isPending}
                >
                  {createTown.isPending ? 'Creating...' : 'Create Town'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Towns</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTownsCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Removed Towns</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{removedTownsCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Towns List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Towns List</CardTitle>
                <CardDescription>
                  All towns in the system
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="show-removed" className="text-sm font-normal">
                  Show removed
                </Label>
                <Switch
                  id="show-removed"
                  checked={showRemoved}
                  onCheckedChange={setShowRemoved}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading towns...</div>
            ) : filteredTowns.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {showRemoved
                    ? 'No towns found in the system'
                    : 'No active towns. Add your first town to get started.'}
                </AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Town</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTowns.map((town) => (
                    <TableRow key={town.id.toString()}>
                      <TableCell className="font-medium">{town.name}</TableCell>
                      <TableCell>{town.province}</TableCell>
                      <TableCell>
                        <Badge
                          variant={town.status === TownStatus.active ? 'default' : 'secondary'}
                        >
                          {town.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {town.status === TownStatus.active && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(town)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setTownToRemove(town)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Town</DialogTitle>
            <DialogDescription>
              Update the town name or province
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-town-name">Town Name</Label>
              <Input
                id="edit-town-name"
                placeholder="e.g., Johannesburg"
                value={editTownName}
                onChange={(e) => setEditTownName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-town-province">Province</Label>
              <SearchableSelect
                options={provinceOptions}
                value={editTownProvince}
                onValueChange={setEditTownProvince}
                placeholder="Select province"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingTown(null);
                setEditTownName('');
                setEditTownProvince('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTown}
              disabled={updateTown.isPending}
            >
              {updateTown.isPending ? 'Updating...' : 'Update Town'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!townToRemove} onOpenChange={() => setTownToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Town</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{townToRemove?.name}</strong>? This will mark
              the town as removed but preserve the data. It will no longer appear in active lists.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveTown}
              disabled={removeTown.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removeTown.isPending ? 'Removing...' : 'Remove Town'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
