import { SignUp } from "@clerk/clerk-react";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { clerkAppearance } from "@/features/auth/utils/clerkAppearance";
import { ROUTES } from "@/config/routesConfig";

// Ver comentario de routing en SignInPage.
export const SignUpPage = () => (
  <AuthPageLayout>
    <SignUp
      appearance={clerkAppearance}
      routing="path"
      path={ROUTES.signUp}
      signInUrl={ROUTES.signIn}
    />
  </AuthPageLayout>
);
