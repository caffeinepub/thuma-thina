import { ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AdminOnlyProps {
  children: ReactNode;
}

export function AdminOnly({ children }: AdminOnlyProps) {
  return (
    <div className="container-custom py-8">
      <Alert variant="destructive" className="border-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Backend Not Implemented</AlertTitle>
        <AlertDescription>
          Admin functionality requires backend implementation. Please implement the backend first.
        </AlertDescription>
      </Alert>
    </div>
  );
}
