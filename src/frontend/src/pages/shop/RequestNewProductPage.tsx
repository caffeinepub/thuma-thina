import { useState } from 'react';
import { useRequestNewProduct, useProvinces } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shop
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Request New Product or Retailer
          </h2>
          <p className="text-muted-foreground">
            Can't find what you're looking for? Let us know and we'll work on adding it.
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 rounded-lg border border-primary/50 bg-primary/10 p-4 flex items-start space-x-3 animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-primary">Request submitted successfully!</p>
              <p className="text-sm text-primary/80 mt-1">
                We'll review your request and work on adding it to our platform.
              </p>
            </div>
          </div>
        )}

        {requestMutation.isError && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Failed to submit request</p>
              <p className="text-sm text-destructive/80 mt-1">
                Please try again later.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-xs">
            <div>
              <label htmlFor="productName" className="block text-sm font-medium text-foreground mb-2">
                Product Name <span className="text-destructive">*</span>
              </label>
              <input
                id="productName"
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.productName ? 'border-destructive' : 'border-input'
                } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all`}
                placeholder="e.g., Fresh Milk 2L"
              />
              {errors.productName && (
                <p className="text-sm text-destructive mt-1.5">{errors.productName}</p>
              )}
            </div>

            <div>
              <label htmlFor="retailerName" className="block text-sm font-medium text-foreground mb-2">
                Retailer Name <span className="text-destructive">*</span>
              </label>
              <input
                id="retailerName"
                type="text"
                value={formData.retailerName}
                onChange={(e) => handleChange('retailerName', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.retailerName ? 'border-destructive' : 'border-input'
                } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all`}
                placeholder="e.g., Pick n Pay"
              />
              {errors.retailerName && (
                <p className="text-sm text-destructive mt-1.5">{errors.retailerName}</p>
              )}
            </div>

            <div>
              <label htmlFor="townSuburb" className="block text-sm font-medium text-foreground mb-2">
                Town / Suburb <span className="text-destructive">*</span>
              </label>
              <input
                id="townSuburb"
                type="text"
                value={formData.townSuburb}
                onChange={(e) => handleChange('townSuburb', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.townSuburb ? 'border-destructive' : 'border-input'
                } bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all`}
                placeholder="e.g., Sandton"
              />
              {errors.townSuburb && (
                <p className="text-sm text-destructive mt-1.5">{errors.townSuburb}</p>
              )}
            </div>

            <div>
              <label htmlFor="province" className="block text-sm font-medium text-foreground mb-2">
                Province <span className="text-destructive">*</span>
              </label>
              <select
                id="province"
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.province ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all`}
              >
                <option value="">Select a province</option>
                {provinces?.map((province) => (
                  <option key={province.name} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-sm text-destructive mt-1.5">{errors.province}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="flex-1 px-6 py-3 rounded-lg border border-border bg-background text-foreground font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={requestMutation.isPending}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
            >
              {requestMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
