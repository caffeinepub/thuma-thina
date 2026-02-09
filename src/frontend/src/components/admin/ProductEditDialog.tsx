import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Package } from 'lucide-react';
import { useUpdateProduct } from '../../hooks/useQueries';
import type { Product } from '../../backend';

interface ProductEditDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function ProductEditDialog({ product, open, onOpenChange, onSuccess, onError }: ProductEditDialogProps) {
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    description: product.description
  });

  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description
      });
      setLocalError(null);
    }
  }, [open, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.name || !formData.category || !formData.description) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      await updateProduct.mutateAsync({
        productId: product.id,
        name: formData.name,
        category: formData.category,
        description: formData.description
      });
      onSuccess();
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update product';
      setLocalError(errorMsg);
      onError(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Edit Product
          </DialogTitle>
          <DialogDescription>Update product information in the universal catalogue</DialogDescription>
        </DialogHeader>

        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-product-name">Product Name *</Label>
            <Input
              id="edit-product-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Fresh Milk 2L"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-product-category">Category *</Label>
            <Input
              id="edit-product-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Dairy"
              required
            />
          </div>

          <div>
            <Label htmlFor="edit-product-description">Description *</Label>
            <Textarea
              id="edit-product-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product description..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateProduct.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
