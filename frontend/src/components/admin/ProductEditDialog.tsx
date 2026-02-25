import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useCreateProduct, useUpdateProduct, type Product, type ProductInput } from '@/hooks/useProducts';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductEditDialog({ open, onOpenChange, product }: ProductEditDialogProps) {
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const isEditing = !!product;
  const isPending = createProduct.isPending || updateProduct.isPending;

  useEffect(() => {
    if (open) {
      if (product) {
        setName(product.name);
        setCategory(product.category);
        setDescription(product.description);
        setImageUrl(product.preferredImage?.url ?? '');
        setCustomCategory('');
      } else {
        setName('');
        setCategory('');
        setDescription('');
        setImageUrl('');
        setCustomCategory('');
      }
    }
  }, [open, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = customCategory.trim() || category;

    if (!name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!finalCategory) {
      toast.error('Category is required');
      return;
    }

    const input: ProductInput = {
      name: name.trim(),
      category: finalCategory,
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
    };

    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({ id: product.id, input });
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(input);
        toast.success('Product created successfully');
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(isEditing ? 'Failed to update product' : 'Failed to create product');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Organic Apples"
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-category">Category *</Label>
            <Select value={category} onValueChange={setCategory} disabled={isPending}>
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={customCategory}
              onChange={e => setCustomCategory(e.target.value)}
              placeholder="Or type a new category..."
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-description">Description</Label>
            <Textarea
              id="product-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the product..."
              rows={3}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-image">Image URL</Label>
            <Input
              id="product-image"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isPending}
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-md border"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductEditDialog;
