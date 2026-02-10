import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Users, ShoppingCart, UserCheck, Truck, MapPin, ArrowRight, FileText } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitRoleApplication, useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Role {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  benefits: string[];
  ctaText: string;
  ctaAction: () => void;
  available: boolean;
}

export function JoinUsPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const submitApplication = useSubmitRoleApplication();
  const { data: isAdmin } = useIsCallerAdmin();
  
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [motivation, setMotivation] = useState('');
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const isAuthenticated = !!identity;

  const handleApplyClick = (roleId: string, roleTitle: string) => {
    // Defensive guard: prevent Master Admin applications
    if (roleId === 'master-admin' || roleTitle === 'Master Admin') {
      return;
    }
    
    if (!isAuthenticated) {
      login();
      return;
    }
    setSelectedRole(roleTitle);
    setMotivation('');
    setShowApplicationDialog(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedRole || !motivation.trim()) return;
    
    // Defensive guard: prevent Master Admin applications
    if (selectedRole === 'Master Admin' || selectedRole === 'master-admin') {
      return;
    }

    try {
      await submitApplication.mutateAsync({
        role: selectedRole,
        motivation: motivation.trim()
      });
      setShowApplicationDialog(false);
      setShowSuccessDialog(true);
      setMotivation('');
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
  };

  const roles: Role[] = [
    {
      id: 'customer',
      title: 'Customer',
      icon: <ShoppingCart className="h-8 w-8" />,
      description: 'Shop from local retailers and get everything you need delivered to your doorstep or pick it up at your convenience.',
      benefits: [
        'Browse products from multiple local retailers',
        'Compare prices and find the best deals',
        'Request products you can\'t find',
        'Flexible delivery and pick-up options'
      ],
      ctaText: 'Start Shopping',
      ctaAction: () => navigate({ to: '/' }),
      available: true
    },
    {
      id: 'cashier',
      title: 'Cashier',
      icon: <UserCheck className="h-8 w-8" />,
      description: 'Work with local retailers to process orders, manage inventory, and serve customers in your community.',
      benefits: [
        'Flexible working hours',
        'Work with local businesses',
        'Earn competitive wages',
        'Build customer service skills'
      ],
      ctaText: isAuthenticated ? 'Apply Now' : 'Login to Apply',
      ctaAction: () => handleApplyClick('cashier', 'Cashier'),
      available: true
    },
    {
      id: 'personal-shopper',
      title: 'Personal Shopper',
      icon: <Users className="h-8 w-8" />,
      description: 'Help customers by shopping for them at local retailers, picking quality products and ensuring satisfaction.',
      benefits: [
        'Set your own schedule',
        'Earn per shopping trip',
        'Build relationships with retailers',
        'Help your community'
      ],
      ctaText: isAuthenticated ? 'Apply Now' : 'Login to Apply',
      ctaAction: () => handleApplyClick('personal-shopper', 'Personal Shopper'),
      available: true
    },
    {
      id: 'delivery-driver',
      title: 'Delivery Driver',
      icon: <Truck className="h-8 w-8" />,
      description: 'Deliver products to customers across your area, providing fast and reliable service to your community.',
      benefits: [
        'Flexible delivery routes',
        'Earn per delivery',
        'Use your own vehicle',
        'Work when it suits you'
      ],
      ctaText: isAuthenticated ? 'Apply Now' : 'Login to Apply',
      ctaAction: () => handleApplyClick('delivery-driver', 'Delivery Driver'),
      available: true
    },
    {
      id: 'pickup-point',
      title: 'Pick-up Point Operator',
      icon: <MapPin className="h-8 w-8" />,
      description: 'Operate a pick-up point where customers can collect their orders at their convenience.',
      benefits: [
        'Run from your location',
        'Earn per package handled',
        'Serve your local community',
        'Flexible operating hours'
      ],
      ctaText: isAuthenticated ? 'Apply Now' : 'Login to Apply',
      ctaAction: () => handleApplyClick('pickup-point', 'Pick-up Point Operator'),
      available: true
    }
  ];

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Join the Thuma Thina Community
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Be part of a platform that connects communities, empowers local businesses, and creates opportunities for everyone.
          </p>
        </div>

        {/* Action Buttons */}
        {isAuthenticated && (
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/my-applications' })}
              className="border-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <FileText className="h-4 w-4 mr-2" />
              View My Applications
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/admin/role-applications' })}
                className="border-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <Users className="h-4 w-4 mr-2" />
                Review Applications (Admin)
              </Button>
            )}
          </div>
        )}

        {/* Role Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card
              key={role.id}
              className="group hover:shadow-warm transition-all duration-300 border-2 hover:border-primary/30 flex flex-col"
            >
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:scale-110 transition-transform">
                    {role.icon}
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <h4 className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wide">
                    Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {role.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={role.ctaAction}
                  disabled={!role.available}
                  className="w-full group-hover:shadow-md transition-shadow"
                  variant={role.id === 'customer' ? 'default' : 'outline'}
                >
                  {role.ctaText}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <Card className="border-2 bg-gradient-to-br from-muted/30 to-muted/10">
            <CardContent className="py-10 px-6">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Why Join Thuma Thina?
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-6">
                Thuma Thina is more than just a platform—it's a community-driven initiative that brings together local retailers, 
                service providers, and customers to create a thriving local economy. Whether you're looking to shop, work, or 
                grow your business, we provide the tools and support you need to succeed.
              </p>
              <div className="grid gap-6 md:grid-cols-3 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Community Focused</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Platform Access</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">Local</div>
                  <div className="text-sm text-muted-foreground">Support & Service</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedRole}</DialogTitle>
            <DialogDescription>
              Tell us why you'd like to join as a {selectedRole}. Your application will be reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivation">Motivation</Label>
              <Textarea
                id="motivation"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Tell us about your experience, skills, and why you want this role..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApplicationDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={!motivation.trim() || submitApplication.isPending}
            >
              {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Submitted!</DialogTitle>
            <DialogDescription>
              Your application for {selectedRole} has been successfully submitted. We'll review it and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert>
              <AlertDescription>
                You can check the status of your application anytime by visiting the "My Applications" page.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate({ to: '/my-applications' });
              }}
            >
              View My Applications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
