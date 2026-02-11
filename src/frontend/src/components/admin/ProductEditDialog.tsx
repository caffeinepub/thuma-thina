import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, X, Plus } from 'lucide-react';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts';
import { useListCategories, useCreateCategory } from '@/hooks/useCategories';
import { SearchableSelect } from '@/components/admin/SearchableSelect';
import { ExternalBlob, type Product } from '@/backend';
import { getExternalBlobUrl } from '@/utils/externalBlobUrl';
import { toast } from 'sonner';

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function ProductEditDialog({ open, onOpenChange, product }: ProductEditDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const { data: categories, isLoading: categoriesLoading } = useListCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const createCategory = useCreateCategory();

  const isEditing = !!product;
  const isLoading = createProduct.isPending || updateProduct.isPending || createCategory.isPending;

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      if (product.preferredImage) {
        setImagePreview(getExternalBlobUrl(product.preferredImage));
      } else if (product.imageRefs.length > 0) {
        setImagePreview(getExternalBlobUrl(product.imageRefs[0]));
      }
      setImageFile(null);
    } else {
      setName('');
      setDescription('');
      setCategory('');
      setImagePreview('');
      setImageFile(null);
    }
    setUploadProgress(0);
    setShowAddCategory(false);
    setNewCategory('');
  }, [product, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      await createCategory.mutateAsync(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory('');
      setShowAddCategory(false);
      toast.success('Category added successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!description.trim()) {
      toast.error('Product description is required');
      return;
    }

    if (!category.trim()) {
      toast.error('Product category is required');
      return;
    }

    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: name.trim(),
          description: description.trim(),
          category: category.trim(),
        });
        toast.success('Product updated successfully');
      } else {
        let imageBlob: ExternalBlob;

        if (imageFile) {
          const arrayBuffer = await imageFile.arrayBuffer();
          const bytes = new Uint8Array(arrayBuffer);
          imageBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
            setUploadProgress(percentage);
          });
        } else {
          toast.error('Product image is required');
          return;
        }

        await createProduct.mutateAsync({
          name: name.trim(),
          description: description.trim(),
          image: imageBlob,
          category: category.trim(),
        });
        toast.success('Product created successfully');
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  const categoryOptions = (categories || []).map((cat) => ({
    value: cat,
    label: cat,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Create Product'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            {showAddCategory ? (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleAddNewCategory}
                  disabled={isLoading}
                >
                  {createCategory.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategory('');
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <SearchableSelect
                  options={categoryOptions}
                  value={category}
                  onValueChange={setCategory}
                  placeholder="Select category"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCategory(true)}
                  disabled={isLoading || categoriesLoading}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Category
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
              disabled={isLoading}
            />
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="image">Product Image *</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <Label htmlFor="image-upload" className="cursor-pointer text-sm text-muted-foreground">
                    Click to upload image
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <Alert>
              <AlertDescription>Uploading image: {uploadProgress}%</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
