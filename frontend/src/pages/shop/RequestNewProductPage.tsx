import React, { useState } from 'react';
import { Package, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function RequestNewProductPage() {
  const [productName, setProductName] = useState('');
  const [retailerName, setRetailerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          Request a New Product
        </h1>
        <p className="text-muted-foreground mt-1">
          Can't find what you're looking for? Let us know!
        </p>
      </div>

      {submitted ? (
        <Alert>
          <AlertDescription>
            Thank you for your request! We'll review it and add the product if possible.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Product Request Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retailerName">Retailer Name</Label>
                <Input
                  id="retailerName"
                  value={retailerName}
                  onChange={(e) => setRetailerName(e.target.value)}
                  placeholder="Where did you see this product?"
                />
              </div>
              <Button type="submit" className="w-full" disabled={!productName.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default RequestNewProductPage;
