import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  useListDriverApplications,
  useApproveDriverApplication,
  useRejectDriverApplication,
  type DriverApplication,
} from '@/hooks/useRoleApplications';
import { toast } from 'sonner';
import { formatICDateTime } from '@/utils/time';

function DriverRow({
  app,
  showActions,
  onApprove,
  onReject,
}: {
  app: DriverApplication;
  showActions: boolean;
  onApprove: (app: DriverApplication) => void;
  onReject: (app: DriverApplication) => void;
}) {
  const statusKind = app.status.__kind__;
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        {app.applicant.toString().slice(0, 16)}...
      </TableCell>
      <TableCell>{app.name}</TableCell>
      <TableCell>{app.vehicleDetails}</TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatICDateTime(app.submittedAt)}
      </TableCell>
      <TableCell>
        <Badge
          variant={
            statusKind === 'approved'
              ? 'default'
              : statusKind === 'rejected'
              ? 'destructive'
              : 'secondary'
          }
        >
          {statusKind}
        </Badge>
      </TableCell>
      {showActions && (
        <TableCell>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => onApprove(app)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => onReject(app)}
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
}

export function AdminDriversPage() {
  const { data: applications = [], isLoading } = useListDriverApplications();
  const approve = useApproveDriverApplication();
  const reject = useRejectDriverApplication();

  const pending = applications.filter(a => a.status.__kind__ === 'pending');
  const approved = applications.filter(a => a.status.__kind__ === 'approved');
  const rejected = applications.filter(a => a.status.__kind__ === 'rejected');

  const handleApprove = async (app: DriverApplication) => {
    try {
      await approve.mutateAsync(app.applicant);
      toast.success(`${app.name} approved as driver`);
    } catch {
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (app: DriverApplication) => {
    try {
      await reject.mutateAsync({ principal: app.applicant, reason: 'Rejected by admin' });
      toast.success(`${app.name}'s application rejected`);
    } catch {
      toast.error('Failed to reject application');
    }
  };

  const renderTable = (apps: DriverApplication[], showActions: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-2 p-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      );
    }
    if (apps.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No applications in this category.
        </div>
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Principal</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map(app => (
            <DriverRow
              key={app.applicant.toString()}
              app={app}
              showActions={showActions}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Drivers</h1>
        <p className="text-muted-foreground">Review and manage driver applications</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="rounded-md border mt-4">
          {renderTable(pending, true)}
        </TabsContent>
        <TabsContent value="approved" className="rounded-md border mt-4">
          {renderTable(approved, false)}
        </TabsContent>
        <TabsContent value="rejected" className="rounded-md border mt-4">
          {renderTable(rejected, false)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDriversPage;
