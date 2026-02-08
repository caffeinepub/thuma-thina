import { useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useBootstrapAdmin } from '../../hooks/useBootstrapAdmin';

export function AdminBootstrapper() {
  const { identity } = useInternetIdentity();
  const bootstrap = useBootstrapAdmin();

  useEffect(() => {
    // Bootstrap hook handles the logic automatically when identity changes
  }, [identity]);

  // This is a non-visual component
  return null;
}
