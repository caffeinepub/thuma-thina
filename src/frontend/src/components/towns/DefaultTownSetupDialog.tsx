import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, MapPin } from 'lucide-react';
import { useActiveTowns } from '@/hooks/useTowns';
import { useGetCallerUserProfile, useSaveUserProfile } from '@/hooks/useUserProfiles';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { toast } from 'sonner';

interface DefaultTownSetupDialogProps {
  open: boolean;
}

export function DefaultTownSetupDialog({ open }: DefaultTownSetupDialogProps) {
  const [selectedTownId, setSelectedTownId] = useState<string>('');
  const { data: activeTowns, isLoading: townsLoading } = useActiveTowns();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfile = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTownId) {
      toast.error('Please select a town');
      return;
    }

    if (!userProfile) {
      toast.error('User profile not found');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        ...userProfile,
        defaultTown: BigInt(selectedTownId),
      });
      toast.success('Default town set successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to set default town');
    }
  };

  const townOptions = (activeTowns || []).map((town) => ({
    value: town.id.toString(),
    label: `${town.name}, ${town.province}`,
  }));

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-primary" />
            <DialogTitle>Select Your Town</DialogTitle>
          </div>
          <DialogDescription>
            Please select your town to continue. This helps us show you relevant products and services in your
            area.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {townsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !activeTowns || activeTowns.length === 0 ? (
            <Alert>
              <AlertDescription>
                No towns are currently available. Please contact support for assistance.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="town">Town *</Label>
                <SearchableSelect
                  options={townOptions}
                  value={selectedTownId}
                  onValueChange={setSelectedTownId}
                  placeholder="Select your town"
                  disabled={saveProfile.isPending}
                />
              </div>

              <Button type="submit" className="w-full" disabled={saveProfile.isPending || !selectedTownId}>
                {saveProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
