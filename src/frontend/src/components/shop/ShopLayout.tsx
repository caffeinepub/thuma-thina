import { ReactNode } from 'react';
import { ShopHeader } from './ShopHeader';
import { ShopFooter } from './ShopFooter';
import { AuthInitializationOverlay } from '@/components/auth/AuthInitializationOverlay';
import { DefaultTownSetupDialog } from '@/components/towns/DefaultTownSetupDialog';
import { ProfileSetupDialog } from '@/components/auth/ProfileSetupDialog';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useEnsureDefaultTownOsizweni } from '@/hooks/useEnsureDefaultTownOsizweni';
import { useGetCallerUserProfile } from '@/hooks/useUserProfiles';

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { shouldShowManualDialog } = useEnsureDefaultTownOsizweni();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  const showDefaultTownSetup = isAuthenticated && shouldShowManualDialog;

  // Show profile setup dialog when authenticated, profile query is fetched, and profile is null
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthInitializationOverlay />
      <DefaultTownSetupDialog open={showDefaultTownSetup} />
      <ProfileSetupDialog open={showProfileSetup} />
      <ShopHeader />
      <main className="flex-1">
        {children}
      </main>
      <ShopFooter />
    </div>
  );
}
