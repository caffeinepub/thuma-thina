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
import { ArrowLeft, ShoppingBag, CheckCircle, XCircle } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';
import { useShopperApplications, useApproveShopper, useRejectShopper } from '@/hooks/useRoleApplications';
import { formatICDateTime } from '@/utils/time';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';
import type { PersonalShopperApplication } from '@/backend';

export function AdminShoppersPage() {
  const { data: applications, isLoading } = useShopperApplications();
  const approveShopper = useApproveShopper();
  const rejectShopper = useRejectShopper();

  const [selectedApplication, setSelectedApplication] = useState<PersonalShopperApplication | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingApplications = applications?.filter((app) => app.status.__kind__ === 'pending') || [];
  const approvedShoppers = applications?.filter((app) => app.status.__kind__ === 'approved') || [];
  const rejectedApplications = applications?.filter((app) => app.status.__kind__ === 'rejected') || [];

  const handleViewDetails = (application: PersonalShopperApplication) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleApprove = async (application: PersonalShopperApplication) => {
    try {
      await approveShopper.mutateAsync(application.applicant);
      toast.success('Shopper application approved');
      setShowDetailsDialog(false);
    } catch (error: any) {
      console.error('Approve error:', error);
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to approve applications');
      } else if (error.message?.includes('already approved')) {
        toast.error('Application is already approved');
      } else {
        toast.error(error.message || 'Failed to approve shopper');
      }
    }
  };

  const handleRejectClick = (application: PersonalShopperApplication) => {
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
      await rejectShopper.mutateAsync({
        applicant: selectedApplication.applicant,
        reason: rejectionReason.trim(),
      });
      toast.success('Shopper application rejected');
      setShowRejectDialog(false);
      setShowDetailsDialog(false);
    } catch (error: any) {
      console.error('Reject error:', error);
      if (error.message?.includes('Unauthorized')) {
        toast.error('You do not have permission to reject applications');
      } else {
        toast.error(error.message || 'Failed to reject shopper');
      }
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
            <ShoppingBag className="h-8 w-8" />
            Shopper Management
          </h1>
          <p className="text-muted-foreground">Review shopper applications and manage approved shoppers</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Applications ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved Shoppers ({approvedShoppers.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Shopper Applications</CardTitle>
                <CardDescription>Review and approve or reject shopper applications</CardDescription>
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
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApplications.map((app) => (
                        <TableRow key={app.applicant.toString()}>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>{formatICDateTime(app.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleViewDetails(app)}>
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(app)}
                                disabled={approveShopper.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectClick(app)}
                                disabled={rejectShopper.isPending}
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
                <CardTitle>Approved Shoppers</CardTitle>
                <CardDescription>Active shoppers on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : approvedShoppers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No approved shoppers yet</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Approved On</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedShoppers.map((app) => (
                        <TableRow key={app.applicant.toString()}>
                          <TableCell className="font-medium">{app.name}</TableCell>
                          <TableCell>{app.email}</TableCell>
                          <TableCell>{app.phone}</TableCell>
                          <TableCell>
                            {app.reviewedAt ? formatICDateTime(app.reviewedAt) : 'N/A'}
                          </TableCell>
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
                <CardDescription>Shopper applications that were rejected</CardDescription>
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
            <DialogTitle>Shopper Application Details</DialogTitle>
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
                <div>
                  <Label>Submitted On</Label>
                  <p className="text-sm mt-1">{formatICDateTime(selectedApplication.submittedAt)}</p>
                </div>
                {selectedApplication.reviewedAt && (
                  <div>
                    <Label>Reviewed On</Label>
                    <p className="text-sm mt-1">{formatICDateTime(selectedApplication.reviewedAt)}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Selfie Image</Label>
                <div className="mt-2">
                  <img
                    src={getExternalBlobUrl(selectedApplication.selfieImage)}
                    alt="Applicant selfie"
                    className="max-w-sm rounded-lg border"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedApplication?.status.__kind__ === 'pending' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectClick(selectedApplication)}
                  disabled={rejectShopper.isPending}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedApplication)}
                  disabled={approveShopper.isPending}
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
            <AlertDialogTitle>Reject Shopper Application</AlertDialogTitle>
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
              rows={4}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              disabled={rejectShopper.isPending || !rejectionReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {rejectShopper.isPending ? 'Rejecting...' : 'Reject Application'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
