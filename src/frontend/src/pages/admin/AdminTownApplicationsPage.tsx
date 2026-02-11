import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import type { Principal } from '@icp-sdk/core/principal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  useApproveAdditionalTown,
  useRejectAdditionalTown,
} from '@/hooks/useTownMembership';

// Note: Backend doesn't expose a method to list pending applications yet
// This is a placeholder implementation that will need backend support

export function AdminTownApplicationsPage() {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Principal | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const approveApplication = useApproveAdditionalTown();
  const rejectApplication = useRejectAdditionalTown();

  const handleApprove = async (applicant: Principal) => {
    try {
      await approveApplication.mutateAsync(applicant);
      toast.success('Application approved successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve application');
    }
  };

  const handleRejectClick = (applicant: Principal) => {
    setSelectedApplicant(applicant);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedApplicant || !rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      await rejectApplication.mutateAsync({
        applicant: selectedApplicant,
        reason: rejectReason,
      });
      toast.success('Application rejected');
      setRejectDialogOpen(false);
      setSelectedApplicant(null);
      setRejectReason('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject application');
    }
  };

  // Placeholder: Backend doesn't expose listPendingApplications yet
  const pendingApplications: any[] = [];
  const isLoading = false;

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Town Applications</h1>
            <p className="text-muted-foreground">
              Review and manage additional town membership applications
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>
              Applications from users requesting access to additional towns
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : pendingApplications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending applications</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Note: Backend support for listing applications is coming soon
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Town</TableHead>
                    <TableHead>Applied At</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApplications.map((application: any) => (
                    <TableRow key={application.user.toString()}>
                      <TableCell className="font-mono text-xs">
                        {application.user.toString().slice(0, 20)}...
                      </TableCell>
                      <TableCell>{application.townName}</TableCell>
                      <TableCell>
                        {new Date(Number(application.appliedAt) / 1_000_000).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(application.user)}
                            disabled={approveApplication.isPending || rejectApplication.isPending}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectClick(application.user)}
                            disabled={approveApplication.isPending || rejectApplication.isPending}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Application</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a reason for rejecting this application. The applicant will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-2 py-4">
              <Label htmlFor="reject-reason">Reason</Label>
              <Input
                id="reject-reason"
                placeholder="Enter rejection reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRejectReason('')}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRejectConfirm}
                disabled={!rejectReason.trim() || rejectApplication.isPending}
              >
                {rejectApplication.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  'Reject Application'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
