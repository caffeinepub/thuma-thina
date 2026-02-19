import { ReactNode } from 'react';
import { ShopHeader } from './ShopHeader';
import { ShopFooter } from './ShopFooter';
import { AuthInitializationOverlay } from '@/components/auth/AuthInitializationOverlay';
import { DefaultTownSetupDialog } from '@/components/towns/DefaultTownSetupDialog';
import { ProfileSetupDialog } from '@/components/auth/ProfileSetupDialog';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useUserProfiles';

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();

  // Show profile setup dialog when authenticated, profile query is fetched, and profile is null
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  // Show default town setup when authenticated, has profile, but no default town
  // Check if defaultTown is missing (null, undefined) or if it's not a valid bigint
  const hasValidDefaultTown = userProfile?.defaultTown !== null && 
                               userProfile?.defaultTown !== undefined && 
                               typeof userProfile?.defaultTown === 'bigint';
  
  const showDefaultTownSetup = 
    isAuthenticated && 
    !profileLoading && 
    profileFetched && 
    userProfile !== null && 
    userProfile !== undefined &&
    !hasValidDefaultTown;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthInitializationOverlay />
      <ProfileSetupDialog open={showProfileSetup} />
      <DefaultTownSetupDialog open={showDefaultTownSetup} />
      <ShopHeader />
      <main className="flex-1">
        {children}
      </main>
      <ShopFooter />
    </div>
  );
}
