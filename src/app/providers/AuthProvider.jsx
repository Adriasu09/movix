import { ClerkProvider } from '@clerk/clerk-react';
import { esES } from '@clerk/localizations';
import { env } from '@/config/envConfig';

export const AuthProvider = ({ children }) => {
  return (
    <ClerkProvider publishableKey={env.CLERK_PUBLISHABLE_KEY} localization={esES}>
      {children}
    </ClerkProvider>
  );
};
