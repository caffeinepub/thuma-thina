import React from 'react';
import RequireAdmin from '@/components/auth/RequireAdmin';
import {
  Package,
  Store,
  ShoppingBag,
  Users,
  Truck,
  MapPin,
  Settings,
  ClipboardList,
  Building2,
  Map,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AdminNavCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const adminSections: AdminNavCard[] = [
  {
    title: 'Personal Shoppers',
    description: 'Review and manage personal shopper applications',
    href: '#/admin/shoppers',
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: 'Delivery Drivers',
    description: 'Review and manage driver applications',
    href: '#/admin/drivers',
    icon: <Truck className="h-6 w-6" />,
  },
  {
    title: 'Pickup Points',
    description: 'Review and manage pickup point applications',
    href: '#/admin/pickup-points',
    icon: <MapPin className="h-6 w-6" />,
    badge: 'Active',
    badgeVariant: 'default',
  },
  {
    title: 'Retailers',
    description: 'Manage retail partners and their information',
    href: '#/admin/retailers',
    icon: <Store className="h-6 w-6" />,
  },
  {
    title: 'Products',
    description: 'Manage the product catalogue',
    href: '#/admin/products',
    icon: <Package className="h-6 w-6" />,
  },
  {
    title: 'Listings',
    description: 'Manage product listings and pricing',
    href: '#/admin/listings',
    icon: <ShoppingBag className="h-6 w-6" />,
  },
  {
    title: 'Orders',
    description: 'View and manage all customer orders',
    href: '#/admin/orders',
    icon: <ClipboardList className="h-6 w-6" />,
  },
  {
    title: 'Towns',
    description: 'Manage towns and suburbs',
    href: '#/admin/towns',
    icon: <Map className="h-6 w-6" />,
  },
  {
    title: 'System Settings',
    description: 'Configure system settings and danger zone',
    href: '#/admin/settings',
    icon: <Settings className="h-6 w-6" />,
  },
];

export default function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all aspects of the Thuma Thina platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => (
            <a key={section.href} href={section.href} className="group block">
              <Card className="h-full transition-all duration-200 hover:shadow-warm-lg hover:border-primary/30 group-hover:-translate-y-0.5">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {section.icon}
                    </div>
                    {section.badge && (
                      <Badge variant={section.badgeVariant || 'secondary'} className="text-xs">
                        {section.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg mt-3">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </RequireAdmin>
  );
}
