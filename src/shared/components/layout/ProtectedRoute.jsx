import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useSession';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ROUTES } from '@/config/routesConfig';

export const ProtectedRoute = () => {
  const { isLoading, isSignedIn } = useSession();
  const location = useLocation();

  if (isLoading) return <LoadingState />;

  if (!isSignedIn) {
    const target = `${ROUTES.signIn}?from=${encodeURIComponent(location.pathname)}`;
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};
