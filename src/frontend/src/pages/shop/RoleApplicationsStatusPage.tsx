import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Loader2, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useMyRoleApplications } from '../../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function RoleApplicationsStatusPage() {
  const navigate = useNavigate();
  const { data: applications, isLoading, error } = useMyRoleApplications();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-primary text-primary-foreground border-primary/30 border-2"><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="border-2"><XCircle className="h-3.5 w-3.5 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="border-2"><Clock className="h-3.5 w-3.5 mr-1" />Pending</Badge>;
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
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate({ to: '/join' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Join Us
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            My Role Applications
          </h2>
          <p className="text-muted-foreground text-base">
            Track the status of your role applications
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
            <p className="text-muted-foreground text-lg mb-4">No applications yet</p>
            <button
              onClick={() => navigate({ to: '/join' })}
              className="text-primary hover:text-primary/80 font-medium underline decoration-primary/30 hover:decoration-primary/60 transition-colors"
            >
              Apply for a role
            </button>
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
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-2">Motivation:</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg border border-border">
                      {app.motivation}
                    </p>
                  </div>
                  {app.status === 'rejected' && app.rejectionReason && (
                    <Alert variant="destructive" className="border-2">
                      <AlertDescription>
                        <p className="font-semibold text-sm mb-1">Rejection Reason:</p>
                        <p className="text-sm opacity-90">{app.rejectionReason}</p>
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
