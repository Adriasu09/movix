import { useSearchParams } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout';
import { clerkAppearance } from '@/features/auth/utils/clerkAppearance';
import { ROUTES } from '@/config/routesConfig';

export const SignInPage = () => {
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from'); // URLSearchParams.get() ya decodifica %2F → /

  const redirectProps = from ? { forceRedirectUrl: from } : { fallbackRedirectUrl: ROUTES.home };

  return (
    <AuthPageLayout from={from}>
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path={ROUTES.signIn}
        signUpUrl={ROUTES.signUp}
        {...redirectProps}
      />
    </AuthPageLayout>
  );
};
