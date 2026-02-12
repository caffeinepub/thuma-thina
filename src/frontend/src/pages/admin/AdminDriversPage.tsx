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

export function AdminDriversPage() {
  const { data: applications, isLoading } = useDriverApplications();
  const approveDriver = useApproveDriver();
  const rejectDriver = useRejectDriver();

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingApplications = applications?.filter((app) => app.status.__kind__ === 'pending') || [];
  const approvedDrivers = applications?.filter((app) => app.status.__kind__ === 'approved') || [];
  const rejectedApplications = applications?.filter((app) => app.status.__kind__ === 'rejected') || [];

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleApprove = async (applicant: string) => {
    try {
      await approveDriver.mutateAsync(applicant as any);
      toast.success('Driver application approved');
      setShowDetailsDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve driver');
    }
  };

  const handleRejectClick = (application: any) => {
    setSelectedApplication(application);
    setRejectionReason('');
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await rejectDriver.mutateAsync({
        applicant: selectedApplication.applicant as any,
        reason: rejectionReason,
      });
      toast.success('Driver application rejected');
      setShowRejectDialog(false);
      setShowDetailsDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject driver');
    }
  };

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
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Driver Management
          </h1>
          <p className="text-muted-foreground">Review driver applications and manage approved drivers</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Applications ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved Drivers ({approvedDrivers.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Driver Applications</CardTitle>
                <CardDescription>Review and approve or reject driver applications</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : pendingApplications.length === 0 ? (
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
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApplications.map((app) => (
                        <TableRow key={app.applicant.toString()}>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{app.vehicleDetails}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(app)}>
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app.applicant.toString())}
                                disabled={approveDriver.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectClick(app)}
                                disabled={rejectDriver.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
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
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Drivers</CardTitle>
                <CardDescription>Active drivers on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : approvedDrivers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No approved drivers yet</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedDrivers.map((app) => (
                        <TableRow key={app.applicant.toString()}>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{app.vehicleDetails}</TableCell>
                          <TableCell>
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Applications</CardTitle>
                <CardDescription>Driver applications that were rejected</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : rejectedApplications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No rejected applications
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedApplications.map((app) => (
                        <TableRow key={app.applicant.toString()}>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell className="max-w-[300px]">
                            {app.status.__kind__ === 'rejected' ? app.status.rejected : 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejected
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Driver Application Details</DialogTitle>
            <DialogDescription>Review the complete application information</DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <p className="text-sm font-medium mt-1">{selectedApplication.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm font-medium mt-1">{selectedApplication.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm font-medium mt-1">{selectedApplication.phone}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className="mt-1" variant={selectedApplication.status.__kind__ === 'approved' ? 'default' : 'secondary'}>
                    {selectedApplication.status.__kind__}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Vehicle Details</Label>
                <p className="text-sm mt-1">{selectedApplication.vehicleDetails}</p>
              </div>
              <div>
                <Label>KYC Documents</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedApplication.kycDocs.length} document(s) uploaded
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedApplication?.status.__kind__ === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectClick(selectedApplication)}
                  disabled={rejectDriver.isPending}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApplication.applicant.toString())}
                  disabled={approveDriver.isPending}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Driver Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this application. This will be visible to the applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Rejection Reason *</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Enter the reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim() || rejectDriver.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectDriver.isPending ? 'Rejecting...' : 'Confirm Rejection'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
