import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/api/useSupabase';
import { useSession } from '@/features/auth/hooks/useSession';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateRating,
} from '../services/favorites.service';

export const FAVORITES_QUERY_KEY = ['favorites'];

export function useFavorites() {
  const supabase = useSupabase();
  const { user, isSignedIn } = useSession();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => getFavorites(supabase),
    enabled: isSignedIn,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: (movie) => addFavorite(supabase, { userId: user.id, movie }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY }),
  });

  const removeMutation = useMutation({
    mutationFn: (movieId) => removeFavorite(supabase, movieId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY }),
  });

  const updateRatingMutation = useMutation({
    mutationFn: ({ movieId, rating }) => updateRating(supabase, { movieId, rating }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY }),
  });

  return {
    favorites: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    updateRating: updateRatingMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isUpdatingRating: updateRatingMutation.isPending,
  };
}
