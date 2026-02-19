import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';
import { usePickupPointApplications, useApprovePickupPoint, useRejectPickupPoint } from '@/hooks/useRoleApplications';
import { useActiveTowns } from '@/hooks/useTowns';
import { formatICDateTime } from '@/utils/time';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';
import type { PickupPointApplication } from '@/backend';

export function AdminPickupPointsPage() {
  const { data: applications, isLoading } = usePickupPointApplications();
  const { data: activeTowns, isLoading: townsLoading } = useActiveTowns();
  const approvePickupPoint = useApprovePickupPoint();
  const rejectPickupPoint = useRejectPickupPoint();

  const [selectedApplication, setSelectedApplication] = useState<PickupPointApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingApplications = applications?.filter((app) => app.status.__kind__ === 'pending') || [];
  const approvedPickupPoints = applications?.filter((app) => app.status.__kind__ === 'approved') || [];
  const rejectedApplications = applications?.filter((app) => app.status.__kind__ === 'rejected') || [];

  const getTownName = (townId?: bigint): string => {
    if (!townId) return 'Unknown town';
    if (townsLoading) return 'Loading...';
    const town = activeTowns?.find((t) => t.id === townId);
    return town ? `${town.name}, ${town.province}` : 'Unknown town';
  };

  const handleViewDetails = (application: PickupPointApplication) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleApprove = async (application: PickupPointApplication) => {
    try {
      await approvePickupPoint.mutateAsync(application.applicant);
      toast.success('Pickup point approved successfully');
      setShowDetailsDialog(false);
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve pickup point');
    }
  };

  const handleRejectClick = (application: PickupPointApplication) => {
    setSelectedApplication(application);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedApplication) return;

    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await rejectPickupPoint.mutateAsync({
        applicant: selectedApplication.applicant,
        reason: rejectionReason.trim(),
      });
      toast.success('Pickup point application rejected');
      setShowRejectDialog(false);
      setShowDetailsDialog(false);
      setRejectionReason('');
    } catch (error: any) {
      console.error('Rejection error:', error);
      toast.error(error.message || 'Failed to reject application');
    }
  };

  const renderApplicationsTable = (apps: PickupPointApplication[]) => {
    if (apps.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No applications found
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Town</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.applicant.toString()}>
              <TableCell className="font-medium">{app.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{getTownName(app.townId)}</span>
                </div>
              </TableCell>
              <TableCell>{app.contactNumber}</TableCell>
              <TableCell>{formatICDateTime(app.submittedAt)}</TableCell>
              <TableCell>
                {app.status.__kind__ === 'pending' && (
                  <Badge variant="outline">Pending</Badge>
                )}
                {app.status.__kind__ === 'approved' && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                    Approved
                  </Badge>
                )}
                {app.status.__kind__ === 'rejected' && (
                  <Badge variant="destructive">Rejected</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(app)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12 text-muted-foreground">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">Pickup Points Management</h1>
          <p className="text-muted-foreground">
            Review and manage pickup point applications
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedPickupPoints.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedApplications.length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>Review and manage pickup point applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({pendingApplications.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedPickupPoints.length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedApplications.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-6">
                {renderApplicationsTable(pendingApplications)}
              </TabsContent>

              <TabsContent value="approved" className="mt-6">
                {renderApplicationsTable(approvedPickupPoints)}
              </TabsContent>

              <TabsContent value="rejected" className="mt-6">
                {renderApplicationsTable(rejectedApplications)}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Pickup Point Application Details</DialogTitle>
            <DialogDescription>
              Review the application information
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <Label className="text-muted-foreground">Business Name</Label>
                  <p className="font-medium">{selectedApplication.name}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium">{selectedApplication.address}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Town</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{getTownName(selectedApplication.townId)}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Contact Number</Label>
                  <p className="font-medium">{selectedApplication.contactNumber}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Applicant Principal</Label>
                  <p className="font-mono text-sm break-all">
                    {selectedApplication.applicant.toString()}
                  </p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Submitted At</Label>
                  <p className="font-medium">{formatICDateTime(selectedApplication.submittedAt)}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {selectedApplication.status.__kind__ === 'pending' && (
                      <Badge variant="outline">Pending Review</Badge>
                    )}
                    {selectedApplication.status.__kind__ === 'approved' && (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
                        Approved
                      </Badge>
                    )}
                    {selectedApplication.status.__kind__ === 'rejected' && (
                      <Badge variant="destructive">
                        Rejected: {selectedApplication.status.rejected}
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground">Business Image</Label>
                  <div className="mt-2 border rounded-lg p-4 bg-muted/50">
                    <img
                      src={getExternalBlobUrl(selectedApplication.businessImage)}
                      alt="Business"
                      className="max-w-full max-h-96 mx-auto rounded-lg object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                </div>
              </div>

              {selectedApplication.status.__kind__ === 'pending' && (
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetailsDialog(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRejectClick(selectedApplication)}
                    disabled={rejectPickupPoint.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedApplication)}
                    disabled={approvePickupPoint.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}

              {selectedApplication.status.__kind__ !== 'pending' && (
                <DialogFooter>
                  <Button onClick={() => setShowDetailsDialog(false)}>
                    Close
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="rejectionReason">Rejection Reason *</Label>
            <Textarea
              id="rejectionReason"
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim() || rejectPickupPoint.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectPickupPoint.isPending ? 'Rejecting...' : 'Confirm Rejection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
