import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { useSaveCallerUserProfile } from '@/hooks/useUserProfiles';
import { useGetCallerUserProfile } from '@/hooks/useUserProfiles';

export function DefaultTownSetupDialog() {
  const [selectedTownId] = useState<string>('1');
  const saveProfile = useSaveCallerUserProfile();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleSave = async () => {
    if (!userProfile) return;

    await saveProfile.mutateAsync({
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.phone,
      defaultTown: BigInt(selectedTownId),
    });
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Select Your Town
          </DialogTitle>
          <DialogDescription>
            Please select your default town to personalize your shopping experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Town selection will be available once the backend supports town management.
            For now, we'll set a default town for you.
          </p>
          <Button
            onClick={handleSave}
            className="w-full"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Continue
          </Button>
          {saveProfile.isError && (
            <p className="text-sm text-destructive">
              Failed to save. Please try again.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DefaultTownSetupDialog;
