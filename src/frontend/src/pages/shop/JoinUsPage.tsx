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
              onClick={() => navigate({ to: '/join/status' })}
              className="border-2 shadow-sm hover:shadow-md transition-shadow"
            >
              <FileText className="h-4 w-4 mr-2" />
              View My Applications
            </Button>
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/join/admin/applications' })}
                className="border-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Master Admin: Review Applications
              </Button>
            )}
          </div>
        )}

        {/* Roles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card 
              key={role.id} 
              className="flex flex-col border-2 hover:border-primary/40 hover:shadow-warm transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary mb-4 shadow-sm">
                  {role.icon}
                </div>
                <CardTitle className="font-display text-xl">
                  {role.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <h4 className="font-semibold text-sm text-foreground mb-3">
                    Benefits:
                  </h4>
                  <ul className="space-y-2">
                    {role.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm text-muted-foreground">
                        <span className="mr-2 mt-0.5 text-primary font-bold">•</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  onClick={role.ctaAction}
                  className="w-full shadow-sm hover:shadow-md transition-shadow"
                  variant={role.id === 'customer' ? 'default' : 'secondary'}
                >
                  {role.ctaText}
                  {role.id === 'customer' && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="rounded-2xl border-2 border-border bg-gradient-to-br from-card to-muted/30 p-8 sm:p-10 shadow-sm">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto leading-relaxed">
              Start shopping now or apply for a role to join our community of service providers.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate({ to: '/' })}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              Browse Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="sm:max-w-[500px] border-2">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Apply for {selectedRole}</DialogTitle>
            <DialogDescription className="text-base">
              Tell us why you'd like to join as a {selectedRole}. Your application will be reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivation" className="text-base font-semibold">Motivation</Label>
              <Textarea
                id="motivation"
                placeholder="Explain why you want this role and what makes you a good fit..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={6}
                className="resize-none border-2"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters required
              </p>
            </div>
            {submitApplication.isError && (
              <Alert variant="destructive" className="border-2">
                <AlertDescription>
                  Failed to submit application. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowApplicationDialog(false)}
              disabled={submitApplication.isPending}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={!motivation.trim() || motivation.trim().length < 20 || submitApplication.isPending}
              className="shadow-sm"
            >
              {submitApplication.isPending ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[400px] border-2">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Application Submitted!</DialogTitle>
            <DialogDescription className="text-base">
              Your application has been received and will be reviewed by our team. You can check the status in your applications page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                navigate({ to: '/join/status' });
              }}
              className="w-full shadow-sm"
            >
              View My Applications
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
