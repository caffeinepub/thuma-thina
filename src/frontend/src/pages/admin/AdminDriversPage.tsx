import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { ArrowLeft, Truck, CheckCircle, XCircle } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';
import { useDriverApplications, useApproveDriver, useRejectDriver } from '@/hooks/useRoleApplications';
import { formatICDateTime } from '@/utils/time';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';
import type { DriverApplication } from '@/backend';
import { Principal } from '@icp-sdk/core/principal';

export function AdminDriversPage() {
  const { data: applications, isLoading } = useDriverApplications();
  const approveDriver = useApproveDriver();
  const rejectDriver = useRejectDriver();

  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingApplications = applications?.filter((app) => app.status.__kind__ === 'pending') || [];
  const approvedDrivers = applications?.filter((app) => app.status.__kind__ === 'approved') || [];
  const rejectedApplications = applications?.filter((app) => app.status.__kind__ === 'rejected') || [];

  const handleViewDetails = (application: DriverApplication) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleApprove = async (applicant: Principal) => {
    try {
      await approveDriver.mutateAsync(applicant);
      toast.success('Driver application approved successfully');
      setShowDetailsDialog(false);
    } catch (error: any) {
      console.error('Approval error:', error);
      toast.error(error.message || 'Failed to approve application');
    }
  };

  const handleRejectClick = (application: DriverApplication) => {
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
      await rejectDriver.mutateAsync({
        applicant: selectedApplication.applicant,
        reason: rejectionReason.trim(),
      });
      toast.success('Driver application rejected');
      setShowRejectDialog(false);
      setShowDetailsDialog(false);
      setRejectionReason('');
    } catch (error: any) {
      console.error('Rejection error:', error);
      toast.error(error.message || 'Failed to reject application');
    }
  };

  const renderApplicationRow = (app: DriverApplication) => (
    <TableRow key={app.applicant.toString()}>
      <TableCell className="font-medium">{app.name}</TableCell>
      <TableCell>{app.email}</TableCell>
      <TableCell>{app.phone}</TableCell>
      <TableCell className="max-w-xs truncate">{app.vehicleDetails}</TableCell>
      <TableCell>{formatICDateTime(app.submittedAt)}</TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(app)}>
          View Details
        </Button>
      </TableCell>
    </TableRow>
  );

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Driver Applications</h1>
            <p className="text-muted-foreground">Review and manage driver applications</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
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
              <div className="text-2xl font-bold">{approvedDrivers.length}</div>
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

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved ({approvedDrivers.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Applications</CardTitle>
                <CardDescription>Review and approve or reject driver applications</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending applications
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApplications.map(renderApplicationRow)}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Drivers</CardTitle>
                <CardDescription>List of approved driver applications</CardDescription>
              </CardHeader>
              <CardContent>
                {approvedDrivers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No approved drivers yet
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedDrivers.map(renderApplicationRow)}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>List of rejected driver applications</CardDescription>
              </CardHeader>
              <CardContent>
                {rejectedApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No rejected applications
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedApplications.map(renderApplicationRow)}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedApplication && (
          <>
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Driver Application Details</DialogTitle>
                  <DialogDescription>
                    Review the complete application information
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          selectedApplication.status.__kind__ === 'approved'
                            ? 'default'
                            : selectedApplication.status.__kind__ === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {selectedApplication.status.__kind__ === 'pending' && 'Pending Review'}
                        {selectedApplication.status.__kind__ === 'approved' && 'Approved'}
                        {selectedApplication.status.__kind__ === 'rejected' && 'Rejected'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="text-sm font-medium">
                        {formatICDateTime(selectedApplication.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <p className="text-sm mt-1">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm mt-1">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm mt-1">{selectedApplication.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label>Vehicle Details</Label>
                      <p className="text-sm mt-1">{selectedApplication.vehicleDetails}</p>
                    </div>
                  </div>

                  {selectedApplication.kycDocs && selectedApplication.kycDocs.length > 0 && (
                    <div>
                      <Label>Selfie Image</Label>
                      <div className="mt-2 border rounded-lg p-4 bg-muted/50">
                        <img
                          src={getExternalBlobUrl(selectedApplication.kycDocs[0])}
                          alt="Driver selfie"
                          className="max-w-md mx-auto rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {selectedApplication.status.__kind__ === 'rejected' && (
                    <div>
                      <Label>Rejection Reason</Label>
                      <p className="text-sm mt-1 text-destructive">
                        {selectedApplication.status.rejected}
                      </p>
                    </div>
                  )}
                </div>

                {selectedApplication.status.__kind__ === 'pending' && (
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleRejectClick(selectedApplication)}
                      disabled={rejectDriver.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedApplication.applicant)}
                      disabled={approveDriver.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>

            <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject Driver Application</AlertDialogTitle>
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
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleRejectConfirm}
                    disabled={!rejectionReason.trim() || rejectDriver.isPending}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {rejectDriver.isPending ? 'Rejecting...' : 'Reject Application'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
