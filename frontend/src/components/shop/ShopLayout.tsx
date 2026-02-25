import React, { useState } from 'react';
import ShopHeader from './ShopHeader';
import { ShopFooter } from './ShopFooter';
import { AuthInitializationOverlay } from '@/components/auth/AuthInitializationOverlay';
import { ProfileSetupDialog } from '@/components/auth/ProfileSetupDialog';
import { DefaultTownSetupDialog } from '@/components/towns/DefaultTownSetupDialog';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '@/hooks/useUserProfiles';

interface ShopLayoutProps {
  children: React.ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  const showProfileSetup =
    isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const hasValidDefaultTown =
    userProfile?.defaultTown !== undefined &&
    userProfile?.defaultTown !== null &&
    typeof userProfile.defaultTown === 'bigint';

  const showTownSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile !== null &&
    !hasValidDefaultTown;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthInitializationOverlay />
      <ShopHeader />
      <main className="flex-1">
        {children}
      </main>
      <ShopFooter />
      {showProfileSetup && <ProfileSetupDialog />}
      {!showProfileSetup && showTownSetup && <DefaultTownSetupDialog />}
    </div>
  );
}

export default ShopLayout;
