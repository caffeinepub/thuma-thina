import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Users, Package, Store, FileText } from 'lucide-react';
import { useListApprovals, useSetApproval } from '@/hooks/useQueries';
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
import { ApprovalStatus } from '@/backend';
import { toast } from 'sonner';

export function AdminDashboardPage() {
  const { data: approvals, isLoading } = useListApprovals();
  const setApproval = useSetApproval();

  const handleApprove = async (principal: string) => {
    try {
      await setApproval.mutateAsync({
        user: principal as any,
        status: ApprovalStatus.approved,
      });
      toast.success('User approved successfully');
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (principal: string) => {
    try {
      await setApproval.mutateAsync({
        user: principal as any,
        status: ApprovalStatus.rejected,
      });
      toast.success('User rejected');
    } catch (error) {
      toast.error('Failed to reject user');
    }
  };

  const pendingCount = approvals?.filter((a) => a.status === ApprovalStatus.pending).length || 0;
  const approvedCount = approvals?.filter((a) => a.status === ApprovalStatus.approved).length || 0;

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage the Thuma Thina platform
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Platform Development Status</AlertTitle>
          <AlertDescription>
            The full admin console is being implemented. Currently available: user approval management. Coming soon: product catalog, retailer management, listings, and application reviews.
          </AlertDescription>
        </Alert>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedCount}</div>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Retailers</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* User Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>User Approvals</CardTitle>
            <CardDescription>
              Manage user access to the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : !approvals || approvals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No approval requests yet
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Principal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((approval) => (
                    <TableRow key={approval.principal.toString()}>
                      <TableCell className="font-mono text-xs">
                        {approval.principal.toString().slice(0, 20)}...
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            approval.status === ApprovalStatus.approved
                              ? 'default'
                              : approval.status === ApprovalStatus.pending
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {approval.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {approval.status === ApprovalStatus.pending && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(approval.principal.toString())}
                              disabled={setApproval.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(approval.principal.toString())}
                              disabled={setApproval.isPending}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Coming Soon Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="opacity-50">
            <CardHeader>
              <Package className="h-8 w-8 text-muted-foreground mb-2" />
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage the global product catalog
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <Store className="h-8 w-8 text-muted-foreground mb-2" />
              <CardTitle>Retailer Management</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Register and manage retailers across South Africa
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <FileText className="h-8 w-8 text-muted-foreground mb-2" />
              <CardTitle>Listings Management</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create retailer-specific product listings with pricing
              </p>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <Users className="h-8 w-8 text-muted-foreground mb-2" />
              <CardTitle>Role Applications</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review and approve driver, shopper, and pickup point applications
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
