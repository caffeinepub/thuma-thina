import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Edit, Trash2, Store, Info } from 'lucide-react';
import { useListRetailers, useDeleteRetailer } from '@/hooks/useRetailers';
import { RetailerEditDialog } from '@/components/admin/RetailerEditDialog';
import { toast } from 'sonner';
import { navigate } from '@/router/HashRouter';
import type { Retailer } from '@/backend';

export function AdminRetailersPage() {
  const { data: retailers, isLoading } = useListRetailers();
  const deleteRetailer = useDeleteRetailer();

  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [retailerToDelete, setRetailerToDelete] = useState<Retailer | null>(null);

  const filteredRetailers = retailers?.filter(
    (retailer) =>
      retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.townSuburb.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.province.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setSelectedRetailer(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (retailer: Retailer) => {
    setRetailerToDelete(retailer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!retailerToDelete) return;

    try {
      await deleteRetailer.mutateAsync(retailerToDelete.id);
      toast.success('Retailer deleted successfully');
      setDeleteDialogOpen(false);
      setRetailerToDelete(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete retailer');
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Retailer Management</h1>
            <p className="text-muted-foreground">Register and manage retailers across all towns</p>
          </div>
          <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Retailers registered here can be linked to products via listings. Manage retailer details, locations,
            and operating hours from this page.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Retailers</CardTitle>
                <CardDescription>{retailers?.length || 0} retailers registered</CardDescription>
              </div>
              <Button onClick={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Add Retailer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search retailers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading retailers...</div>
              ) : !filteredRetailers || filteredRetailers.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No retailers match your search' : 'No retailers yet'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={handleCreateNew}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Retailer
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRetailers.map((retailer) => (
                      <TableRow key={Number(retailer.id)}>
                        <TableCell className="font-medium">{retailer.name}</TableCell>
                        <TableCell>
                          {retailer.townSuburb}, {retailer.province}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{retailer.phone}</div>
                            <div className="text-muted-foreground">{retailer.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(retailer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(retailer)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <RetailerEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          retailer={selectedRetailer}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Retailer</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{retailerToDelete?.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} disabled={deleteRetailer.isPending}>
                {deleteRetailer.isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
