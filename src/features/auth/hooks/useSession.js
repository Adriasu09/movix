import { useUser, useAuth } from "@clerk/clerk-react";

export function useSession() {
  const { isLoaded: userLoaded, user: clerkUser } = useUser();
  const { isLoaded: authLoaded, isSignedIn } = useAuth();

  const isLoading = !userLoaded || !authLoaded;

  if (isLoading || !isSignedIn || !clerkUser) {
    return { user: null, isLoading, isSignedIn: Boolean(isSignedIn) };
  }

  const user = {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
    firstName: clerkUser.firstName ?? null,
    lastName: clerkUser.lastName ?? null,
    fullName: clerkUser.fullName ?? null,
    username: clerkUser.username ?? null,
    imageUrl: clerkUser.imageUrl ?? null,
    createdAt: clerkUser.createdAt ?? null,
  };

  return { user, isLoading: false, isSignedIn: true };
}
