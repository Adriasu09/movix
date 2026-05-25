import { SignIn } from "@clerk/clerk-react";
import { AuthPageLayout } from "@/features/auth/components/AuthPageLayout";
import { clerkAppearance } from "@/features/auth/utils/clerkAppearance";
import { ROUTES } from "@/config/routesConfig";

export const SignInPage = () => (
  <AuthPageLayout>
    <SignIn
      appearance={clerkAppearance}
      routing="path"
      path={ROUTES.signIn}
      signUpUrl={ROUTES.signUp}
    />
  </AuthPageLayout>
);
