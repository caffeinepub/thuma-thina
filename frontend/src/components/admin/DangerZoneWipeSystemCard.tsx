import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Trash2, CheckCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useWipeSystem } from '@/hooks/useSystemSettings';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

export function DangerZoneWipeSystemCard() {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const wipeSystem = useWipeSystem();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleWipeClick = () => {
    setConfirmText('');
    setShowConfirmDialog(true);
  };

  const handleWipeConfirm = async () => {
    if (confirmText !== 'WIPE') {
      toast.error('Please type "WIPE" to confirm');
      return;
    }

    try {
      await wipeSystem.mutateAsync();
      setShowConfirmDialog(false);
      setShowSuccess(true);
      toast.success('System wiped successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to wipe system');
    }
  };

  const handleLogoutAndReload = async () => {
    await clear();
    queryClient.clear();
    window.location.reload();
  };

  if (showSuccess) {
    return (
      <Card className="border-green-500 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle className="h-5 w-5" />
            System Wiped Successfully
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400">
            All system data has been reset to initial state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-500 bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
            <AlertTitle className="text-green-700 dark:text-green-300">Operation Complete</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-400">
              The system has been successfully reset. Please log out and reload the page to continue.
            </AlertDescription>
          </Alert>
          <Button onClick={handleLogoutAndReload} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out and Reload
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Wipe System Data
          </CardTitle>
          <CardDescription>
            Permanently delete all system data and reset to initial state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning: Irreversible Action</AlertTitle>
            <AlertDescription>
              This will permanently delete all data including users, approvals, towns, products, listings,
              retailers, orders, and role applications. This action cannot be undone.
            </AlertDescription>
          </Alert>
          <Button
            variant="destructive"
            onClick={handleWipeClick}
            disabled={wipeSystem.isPending}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {wipeSystem.isPending ? 'Wiping System...' : 'Wipe All System Data'}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm System Wipe
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all system data and cannot be undone. To confirm, please
              type <strong>WIPE</strong> in the field below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="confirm-wipe">Type "WIPE" to confirm</Label>
            <Input
              id="confirm-wipe"
              placeholder="WIPE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWipeConfirm}
              disabled={confirmText !== 'WIPE' || wipeSystem.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {wipeSystem.isPending ? 'Wiping...' : 'Confirm Wipe'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
