import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Plus, Info } from 'lucide-react';
import { useGetDefaultTown, useGetAdditionalTowns, useApplyForAdditionalTown } from '@/hooks/useTownMembership';
import { useActiveTowns } from '@/hooks/useTowns';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { toast } from 'sonner';
import { navigate } from '@/router/HashRouter';
import type { TownId } from '@/hooks/useTowns';

export function MyTownsPage() {
  const { data: defaultTownId, isLoading: defaultLoading } = useGetDefaultTown();
  const { data: additionalTownIds, isLoading: additionalLoading } = useGetAdditionalTowns();
  const { data: activeTowns, isLoading: townsLoading } = useActiveTowns();
  const applyForTown = useApplyForAdditionalTown();

  const [selectedTownId, setSelectedTownId] = useState<string>('');

  const defaultTown = activeTowns?.find((t) => t.id === defaultTownId);
  const additionalTowns = activeTowns?.filter((t) => additionalTownIds?.includes(t.id)) || [];

  const availableTowns = activeTowns?.filter(
    (t) => t.id !== defaultTownId && !additionalTownIds?.includes(t.id)
  ) || [];

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTownId) {
      toast.error('Please select a town');
      return;
    }

    try {
      await applyForTown.mutateAsync(BigInt(selectedTownId));
      toast.success('Application submitted successfully');
      setSelectedTownId('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
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
            <p className="text-muted-foreground">Manage your town memberships</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Towns functionality is not yet implemented in the backend. This page will be functional once the
            backend is updated.
          </AlertDescription>
        </Alert>

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
                <CardTitle>Additional Towns</CardTitle>
                <CardDescription>Other towns where you can shop</CardDescription>
              </CardHeader>
              <CardContent>
                {additionalTowns.length === 0 ? (
                  <p className="text-muted-foreground">No additional towns yet</p>
                ) : (
                  <div className="space-y-2">
                    {additionalTowns.map((town) => (
                      <div key={town.id.toString()} className="flex items-center gap-3 p-3 border rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{town.name}</p>
                          <p className="text-sm text-muted-foreground">{town.province}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Apply for Additional Town */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for Additional Town</CardTitle>
                <CardDescription>Request access to shop in another town</CardDescription>
              </CardHeader>
              <CardContent>
                {availableTowns.length === 0 ? (
                  <p className="text-muted-foreground">No additional towns available</p>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="town">Select Town</Label>
                      <SearchableSelect
                        options={townOptions}
                        value={selectedTownId}
                        onValueChange={setSelectedTownId}
                        placeholder="Select a town"
                      />
                    </div>

                    <Button type="submit" disabled={applyForTown.isPending || !selectedTownId}>
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Application
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
