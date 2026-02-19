import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useSaveUserProfile } from '@/hooks/useUserProfiles';
import { useActiveTowns } from '@/hooks/useTowns';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { toast } from 'sonner';
import type { UserProfile, TownId } from '@/backend';

interface ProfileSetupDialogProps {
  open: boolean;
  onComplete?: () => void;
}

export function ProfileSetupDialog({ open, onComplete }: ProfileSetupDialogProps) {
  const saveProfile = useSaveUserProfile();
  const { data: towns = [], isLoading: townsLoading } = useActiveTowns();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTownId, setSelectedTownId] = useState<string>('');
  const [error, setError] = useState('');

  const townOptions = towns.map((town) => ({
    value: town.id.toString(),
    label: `${town.name}, ${town.province}`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!phone.trim()) {
      setError('Phone is required');
      return;
    }

    if (!selectedTownId) {
      setError('Town is required');
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      defaultTown: BigInt(selectedTownId),
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success('Profile created successfully');
      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save profile';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const isFormValid = name.trim() && email.trim() && phone.trim() && selectedTownId;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide your information to continue using Thuma Thina. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saveProfile.isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saveProfile.isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+27 XX XXX XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={saveProfile.isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="town">Town *</Label>
            <SearchableSelect
              options={townOptions}
              value={selectedTownId}
              onValueChange={setSelectedTownId}
              placeholder="Select your town"
              disabled={saveProfile.isPending || townsLoading}
            />
            {townsLoading && (
              <p className="text-sm text-muted-foreground">Loading towns...</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={saveProfile.isPending || townsLoading || !isFormValid}
          >
            {saveProfile.isPending ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
