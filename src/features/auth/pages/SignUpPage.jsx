import { useSearchParams } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout';
import { clerkAppearance } from '@/features/auth/utils/clerkAppearance';
import { ROUTES } from '@/config/routesConfig';

export const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');

  const redirectProps = from ? { forceRedirectUrl: from } : { fallbackRedirectUrl: ROUTES.home };

  return (
    <AuthPageLayout from={from}>
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path={ROUTES.signUp}
        signInUrl={ROUTES.signIn}
        {...redirectProps}
      />
    </AuthPageLayout>
  );
};
