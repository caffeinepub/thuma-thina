import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { useWipeSystem } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

const CONFIRMATION_PHRASE = 'WIPE';

export function DangerZoneWipeSystemCard() {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const wipeSystem = useWipeSystem();
  const { clear } = useInternetIdentity();

  const isConfirmationValid = confirmationInput === CONFIRMATION_PHRASE;

  const handleWipe = async () => {
    if (!isConfirmationValid) return;

    try {
      await wipeSystem.mutateAsync();
      setShowSuccess(true);
      setConfirmationInput('');
    } catch (error: any) {
      console.error('Wipe system error:', error);
    }
  };

  const handleRecovery = async () => {
    // Clear authentication and reload
    await clear();
    window.location.reload();
  };

  if (showSuccess) {
    return (
      <Card className="border-primary bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-primary">System Wiped Successfully</CardTitle>
          </div>
          <CardDescription>
            All data has been cleared. The system is now in a fresh state.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-primary bg-primary/10">
            <AlertDescription className="text-primary">
              The next user to log in will become the new Master Admin.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-2">
            <Button onClick={handleRecovery} className="w-full">
              Log Out and Reload
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              You will be logged out and the page will reload to complete the reset.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-destructive">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </div>
        <CardDescription>
          Permanently delete all system data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This will permanently delete all products, retailers, listings, product requests, provinces, users, roles, and approvals. The current Master Admin will be removed, and the next login will become the new Master Admin.
          </AlertDescription>
        </Alert>

        {wipeSystem.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              {wipeSystem.error instanceof Error ? wipeSystem.error.message : 'Failed to wipe system. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="confirmation">
            Type <span className="font-mono font-bold">{CONFIRMATION_PHRASE}</span> to confirm
          </Label>
          <Input
            id="confirmation"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={`Type ${CONFIRMATION_PHRASE} here`}
            disabled={wipeSystem.isPending}
            className="font-mono"
          />
        </div>

        <Button
          variant="destructive"
          onClick={handleWipe}
          disabled={!isConfirmationValid || wipeSystem.isPending}
          className="w-full"
        >
          {wipeSystem.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wiping System...
            </>
          ) : (
            'Wipe All System Data'
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          This action will clear all business data and reset the system to a fresh installation state.
        </p>
      </CardContent>
    </Card>
  );
}
