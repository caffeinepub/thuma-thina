import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { toast } from 'sonner';
import { useSubmitDriverApplication, useGetMyDriverApplication } from '@/hooks/useDriverApplication';
import { fileToBytes, validateImageFile } from '@/utils/fileBytes';

export function DriverApplicationPage() {
  const submitApplication = useSubmitDriverApplication();
  const { data: existingApplication, isLoading: loadingExisting, isFetched } = useGetMyDriverApplication();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleDetails: '',
  });

  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelfieFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setSelfiePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!formData.vehicleDetails.trim()) {
      toast.error('Please enter your vehicle details');
      return;
    }

    if (!selfieFile) {
      toast.error('Please upload a selfie image');
      return;
    }

    try {
      // Convert file to bytes
      const bytes = await fileToBytes(selfieFile);

      // Submit application
      await submitApplication.mutateAsync({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        vehicleDetails: formData.vehicleDetails.trim(),
        selfieBytes: bytes,
      });

      toast.success('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error: any) {
      console.error('Application submission error:', error);
      if (error.message?.includes('already exists')) {
        toast.error('You have already submitted an application');
      } else if (error.message?.includes('Unauthorized')) {
        toast.error('Please log in to submit an application');
      } else {
        toast.error(error.message || 'Failed to submit application');
      }
    }
  };

  const isSubmitting = submitApplication.isPending;
  const showProgress = isSubmitting && uploadProgress > 0 && uploadProgress < 100;
  const hasExistingApplication = isFetched && existingApplication !== null;

  if (loadingExisting) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (hasExistingApplication) {
    return (
      <div className="container-custom py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/join-us')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Join Us
            </Button>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You have already submitted a Driver application. Check your application status on the My Applications page.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Application Already Submitted</CardTitle>
              <CardDescription>You can only submit one application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate('/my-applications')}>
                View My Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/join-us')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Join Us
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">Driver Application</h1>
          <p className="text-muted-foreground">
            Apply to become a delivery driver and serve your community
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please provide accurate information. Your application will be reviewed by our admin team.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Application Form</CardTitle>
            <CardDescription>Fill in your details to apply as a delivery driver</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+27 XX XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="vehicleDetails">Vehicle Details *</Label>
                  <Textarea
                    id="vehicleDetails"
                    placeholder="Describe your vehicle (make, model, year, license plate)"
                    value={formData.vehicleDetails}
                    onChange={(e) => handleInputChange('vehicleDetails', e.target.value)}
                    disabled={isSubmitting}
                    required
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Include vehicle make, model, year, and license plate number
                  </p>
                </div>

                <div>
                  <Label htmlFor="selfie">Selfie Image *</Label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('selfie')?.click()}
                        disabled={isSubmitting}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {selfieFile ? 'Change Image' : 'Upload Selfie'}
                      </Button>
                      {selfieFile && (
                        <span className="text-sm text-muted-foreground">{selfieFile.name}</span>
                      )}
                    </div>
                    <input
                      id="selfie"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={isSubmitting}
                      className="hidden"
                    />
                    {selfiePreview && (
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <img
                          src={selfiePreview}
                          alt="Selfie preview"
                          className="max-w-xs max-h-64 mx-auto rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Upload a clear selfie photo (max 5MB)
                  </p>
                </div>
              </div>

              {showProgress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/join-us')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
