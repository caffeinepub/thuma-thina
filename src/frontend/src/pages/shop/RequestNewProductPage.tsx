import { useState } from 'react';
import { useRequestNewProduct, useProvinces } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function RequestNewProductPage() {
  const navigate = useNavigate();
  const { data: provinces } = useProvinces();
  const requestMutation = useRequestNewProduct();

  const [formData, setFormData] = useState({
    productName: '',
    retailerName: '',
    townSuburb: '',
    province: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!formData.retailerName.trim()) {
      newErrors.retailerName = 'Retailer name is required';
    }
    if (!formData.townSuburb.trim()) {
      newErrors.townSuburb = 'Town/Suburb is required';
    }
    if (!formData.province.trim()) {
      newErrors.province = 'Province is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await requestMutation.mutateAsync(formData);
      setShowSuccess(true);
      setFormData({
        productName: '',
        retailerName: '',
        townSuburb: '',
        province: ''
      });
      setErrors({});
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to submit request:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Request New Product or Retailer
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Can't find what you're looking for? Let us know and we'll work on adding it.
          </p>
        </div>

        {showSuccess && (
          <Alert className="mb-6 border-2 border-primary/50 bg-gradient-to-r from-primary/10 to-accent/10 animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <AlertDescription className="text-primary font-medium">
              <p className="font-semibold">Request submitted successfully!</p>
              <p className="text-sm mt-1 opacity-90">
                We'll review your request and work on adding it to our platform.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {requestMutation.isError && (
          <Alert variant="destructive" className="mb-6 border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>
              <p className="font-semibold">Failed to submit request</p>
              <p className="text-sm mt-1 opacity-90">Please try again later.</p>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border-2 border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-base font-semibold">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="productName"
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                className={`h-12 text-base ${errors.productName ? 'border-destructive border-2' : 'border-2'}`}
                placeholder="e.g., Fresh Milk 2L"
              />
              {errors.productName && (
                <p className="text-sm text-destructive font-medium">{errors.productName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="retailerName" className="text-base font-semibold">
                Retailer Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="retailerName"
                type="text"
                value={formData.retailerName}
                onChange={(e) => handleChange('retailerName', e.target.value)}
                className={`h-12 text-base ${errors.retailerName ? 'border-destructive border-2' : 'border-2'}`}
                placeholder="e.g., Pick n Pay"
              />
              {errors.retailerName && (
                <p className="text-sm text-destructive font-medium">{errors.retailerName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="townSuburb" className="text-base font-semibold">
                Town / Suburb <span className="text-destructive">*</span>
              </Label>
              <Input
                id="townSuburb"
                type="text"
                value={formData.townSuburb}
                onChange={(e) => handleChange('townSuburb', e.target.value)}
                className={`h-12 text-base ${errors.townSuburb ? 'border-destructive border-2' : 'border-2'}`}
                placeholder="e.g., Sandton"
              />
              {errors.townSuburb && (
                <p className="text-sm text-destructive font-medium">{errors.townSuburb}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province" className="text-base font-semibold">
                Province <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.province} onValueChange={(value) => handleChange('province', value)}>
                <SelectTrigger className={`h-12 text-base ${errors.province ? 'border-destructive border-2' : 'border-2'}`}>
                  <SelectValue placeholder="Select a province" />
                </SelectTrigger>
                <SelectContent>
                  {provinces?.map((province) => (
                    <SelectItem key={province.name} value={province.name}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && (
                <p className="text-sm text-destructive font-medium">{errors.province}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="flex-1 h-12 text-base border-2"
              size="lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={requestMutation.isPending}
              className="flex-1 h-12 text-base shadow-md hover:shadow-lg transition-shadow"
              size="lg"
            >
              {requestMutation.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
