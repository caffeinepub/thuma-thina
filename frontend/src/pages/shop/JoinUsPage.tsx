import React from 'react';
import { Users, Truck, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const roles = [
  {
    title: 'Personal Shopper',
    description: 'Shop on behalf of customers and earn income in your community.',
    icon: <Users className="h-8 w-8" />,
    href: '#/apply/shopper',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    title: 'Delivery Driver',
    description: 'Deliver orders to customers and earn flexible income.',
    icon: <Truck className="h-8 w-8" />,
    href: '#/apply/driver',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950',
  },
  {
    title: 'Pickup Point',
    description: 'Host a pickup point for your community and earn commissions.',
    icon: <MapPin className="h-8 w-8" />,
    href: '#/apply/pickup-point',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-950',
  },
];

export function JoinUsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">
          Join Our Community
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Become part of the Thuma Thina ecosystem and earn income while serving your community.
        </p>
      </div>

      <Alert className="mb-8">
        <AlertDescription>
          Applications are reviewed by our admin team. You'll be notified once your application is processed.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.title} className="flex flex-col">
            <CardHeader>
              <div className={`w-14 h-14 rounded-xl ${role.bg} ${role.color} flex items-center justify-center mb-3`}>
                {role.icon}
              </div>
              <CardTitle>{role.title}</CardTitle>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <a href={role.href}>
                <Button className="w-full" variant="outline">
                  Apply Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already applied?{' '}
          <a href="#/my-applications" className="text-primary underline">
            Check your application status
          </a>
        </p>
      </div>
    </div>
  );
}

export default JoinUsPage;
