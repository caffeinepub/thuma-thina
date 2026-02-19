import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { MapPin, AlertCircle } from 'lucide-react';
import { useGetDefaultTown, useSetDefaultTown } from '@/hooks/useTownMembership';
import { useActiveTowns } from '@/hooks/useTowns';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { navigate } from '@/router/HashRouter';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MyTownsPage() {
  const { data: defaultTownId, isLoading: defaultLoading, error: defaultError } = useGetDefaultTown();
  const { data: activeTowns, isLoading: townsLoading, error: townsError } = useActiveTowns();
  const setDefaultTown = useSetDefaultTown();

  const [selectedTownId, setSelectedTownId] = useState<string>('');

  const defaultTown = activeTowns?.find((t) => t.id === defaultTownId);

  const townOptions = (activeTowns || []).map((town) => ({
    value: town.id.toString(),
    label: `${town.name}, ${town.province}`,
  }));

  const handleSetDefaultTown = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTownId) {
      return;
    }

    try {
      await setDefaultTown.mutateAsync(BigInt(selectedTownId));
      setSelectedTownId('');
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const isLoading = defaultLoading || townsLoading;
  const hasError = defaultError || townsError;

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Towns</h1>
            <p className="text-muted-foreground">Manage your default town for shopping</p>
          </div>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>

        {hasError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load towns data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <>
            {/* Current Default Town */}
            <Card>
              <CardHeader>
                <CardTitle>Current Default Town</CardTitle>
                <CardDescription>Your primary town for shopping and deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                {defaultTown ? (
                  <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
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

            {/* Change Default Town */}
            <Card>
              <CardHeader>
                <CardTitle>Change Default Town</CardTitle>
                <CardDescription>Select a new default town from all available towns</CardDescription>
              </CardHeader>
              <CardContent>
                {townOptions.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No towns available. Please contact an administrator.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSetDefaultTown} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="town">Select Town</Label>
                      <SearchableSelect
                        options={townOptions}
                        value={selectedTownId}
                        onValueChange={setSelectedTownId}
                        placeholder="Choose a town"
                        disabled={setDefaultTown.isPending}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={setDefaultTown.isPending || !selectedTownId}
                      className="w-full sm:w-auto"
                    >
                      {setDefaultTown.isPending ? 'Updating...' : 'Set as Default Town'}
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
