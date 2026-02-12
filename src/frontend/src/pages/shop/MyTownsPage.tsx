import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Trash2 } from 'lucide-react';
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
import { useGetDefaultTown, useGetAdditionalTowns, useAddFavoriteTown, useRemoveFavoriteTown } from '@/hooks/useTownMembership';
import { useActiveTowns } from '@/hooks/useTowns';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { toast } from 'sonner';
import { navigate } from '@/router/HashRouter';
import type { TownId } from '@/hooks/useTowns';

export function MyTownsPage() {
  const { data: defaultTownId, isLoading: defaultLoading } = useGetDefaultTown();
  const { data: additionalTownIds, isLoading: additionalLoading } = useGetAdditionalTowns();
  const { data: activeTowns, isLoading: townsLoading } = useActiveTowns();
  const addFavoriteTown = useAddFavoriteTown();
  const removeFavoriteTown = useRemoveFavoriteTown();

  const [selectedTownId, setSelectedTownId] = useState<string>('');
  const [removeTownId, setRemoveTownId] = useState<TownId | null>(null);

  const defaultTown = activeTowns?.find((t) => t.id === defaultTownId);
  const additionalTowns = activeTowns?.filter((t) => additionalTownIds?.includes(t.id)) || [];

  const availableTowns = activeTowns?.filter(
    (t) => t.id !== defaultTownId && !additionalTownIds?.includes(t.id)
  ) || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTownId) {
      toast.error('Please select a town');
      return;
    }

    try {
      await addFavoriteTown.mutateAsync(BigInt(selectedTownId));
      toast.success('Town added to favorites');
      setSelectedTownId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add town');
    }
  };

  const handleRemoveClick = (townId: TownId) => {
    setRemoveTownId(townId);
  };

  const handleRemoveConfirm = async () => {
    if (!removeTownId) return;

    try {
      await removeFavoriteTown.mutateAsync(removeTownId);
      toast.success('Town removed from favorites');
      setRemoveTownId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove town');
    }
  };

  const townOptions = availableTowns.map((town) => ({
    value: town.id.toString(),
    label: `${town.name}, ${town.province}`,
  }));

  const isLoading = defaultLoading || additionalLoading || townsLoading;

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Towns</h1>
            <p className="text-muted-foreground">Manage your favorite towns for shopping</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Default Town */}
            <Card>
              <CardHeader>
                <CardTitle>Default Town</CardTitle>
                <CardDescription>Your primary town for shopping and deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                {defaultTown ? (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{defaultTown.name}</p>
                      <p className="text-sm text-muted-foreground">{defaultTown.province}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No default town set</p>
                )}
              </CardContent>
            </Card>

            {/* Additional Towns */}
            <Card>
              <CardHeader>
                <CardTitle>Favorite Towns</CardTitle>
                <CardDescription>Other towns where you can shop</CardDescription>
              </CardHeader>
              <CardContent>
                {additionalTowns.length === 0 ? (
                  <p className="text-muted-foreground">No favorite towns yet</p>
                ) : (
                  <div className="space-y-2">
                    {additionalTowns.map((town) => (
                      <div key={town.id.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{town.name}</p>
                            <p className="text-sm text-muted-foreground">{town.province}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveClick(town.id)}
                          disabled={removeFavoriteTown.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Favorite Town */}
            <Card>
              <CardHeader>
                <CardTitle>Add Favorite Town</CardTitle>
                <CardDescription>Add another town to your favorites</CardDescription>
              </CardHeader>
              <CardContent>
                {availableTowns.length === 0 ? (
                  <p className="text-muted-foreground">No additional towns available</p>
                ) : (
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="town">Select Town</Label>
                      <SearchableSelect
                        options={townOptions}
                        value={selectedTownId}
                        onValueChange={setSelectedTownId}
                        placeholder="Select a town"
                      />
                    </div>

                    <Button type="submit" disabled={addFavoriteTown.isPending || !selectedTownId}>
                      <Plus className="mr-2 h-4 w-4" />
                      {addFavoriteTown.isPending ? 'Adding...' : 'Add to Favorites'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Remove Confirmation Dialog */}
      <AlertDialog open={!!removeTownId} onOpenChange={() => setRemoveTownId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Favorite Town</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this town from your favorites? You can add it back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveConfirm}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
