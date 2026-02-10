import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Loader2, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { usePendingRoleApplications, useApproveRoleApplication, useRejectRoleApplication } from '../../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MasterAdminRoleApplicationsPage() {
  const navigate = useNavigate();
  const { data: applications, isLoading, error } = usePendingRoleApplications();
  const approveMutation = useApproveRoleApplication();
  const rejectMutation = useRejectRoleApplication();

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApproveClick = (app: any) => {
    setSelectedApplication(app);
    setShowApproveDialog(true);
  };

  const handleRejectClick = (app: any) => {
    setSelectedApplication(app);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedApplication) return;
    try {
      await approveMutation.mutateAsync(selectedApplication.applicationId);
      setShowApproveDialog(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Failed to approve application:', error);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) return;
    try {
      await rejectMutation.mutateAsync({
        applicationId: selectedApplication.applicationId,
        reason: rejectionReason.trim()
      });
      setShowRejectDialog(false);
      setSelectedApplication(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Failed to reject application:', error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate({ to: '/join-us' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Join Us
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Pending Role Applications
          </h2>
          <p className="text-muted-foreground text-base">
            Review and manage role applications from users
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="border-2">
            <AlertDescription>
              <p className="font-semibold">Error loading applications</p>
              <p className="text-sm mt-1 opacity-90">Please try again later</p>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && applications && applications.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">No pending applications</p>
          </div>
        )}

        {applications && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <Card key={index} className="border-2 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-display text-xl mb-2">{app.role}</CardTitle>
                      <CardDescription className="text-sm">
                        Applied on {formatDate(app.submittedAt)}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-1 font-mono">
                        {app.applicant.toString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="border-2">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2">Motivation:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border border-border">
                      {app.motivation}
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => handleApproveClick(app)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="flex-1 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectClick(app)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="flex-1 border-2 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent className="sm:max-w-[400px] border-2">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Approve Application</DialogTitle>
            <DialogDescription className="text-base">
              Are you sure you want to approve this application for {selectedApplication?.role}?
            </DialogDescription>
          </DialogHeader>
          {approveMutation.isError && (
            <Alert variant="destructive" className="border-2">
              <AlertDescription>
                Failed to approve application. Please try again.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApproveDialog(false)}
              disabled={approveMutation.isPending}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApprove}
              disabled={approveMutation.isPending}
              className="shadow-sm"
            >
              {approveMutation.isPending ? 'Approving...' : 'Confirm Approval'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px] border-2">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Reject Application</DialogTitle>
            <DialogDescription className="text-base">
              Please provide a reason for rejecting this application for {selectedApplication?.role}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectionReason" className="text-base font-semibold">
                Rejection Reason <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why this application is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none border-2"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 10 characters required
              </p>
            </div>
            {rejectMutation.isError && (
              <Alert variant="destructive" className="border-2">
                <AlertDescription>
                  Failed to reject application. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={rejectMutation.isPending}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={rejectionReason.trim().length < 10 || rejectMutation.isPending}
              className="border-2 shadow-sm"
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
