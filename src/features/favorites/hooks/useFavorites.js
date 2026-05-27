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

    onMutate: async (movie) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY);

      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old = []) => [
        {
          id: `temp-${movie.id}`,
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          poster_url: movie.posterUrl ?? null,
          release_year: movie.releaseYear ?? null,
          personal_rating: null,
          created_at: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previousFavorites };
    },

    onError: (_err, _movie, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (movieId) => removeFavorite(supabase, movieId),

    onMutate: async (movieId) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY);

      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old = []) =>
        old.filter((f) => f.movie_id !== movieId)
      );

      return { previousFavorites };
    },

    onError: (_err, _movieId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: ({ movieId, rating }) => updateRating(supabase, { movieId, rating }),

    onMutate: async ({ movieId, rating }) => {
      await queryClient.cancelQueries({ queryKey: FAVORITES_QUERY_KEY });
      const previousFavorites = queryClient.getQueryData(FAVORITES_QUERY_KEY);

      queryClient.setQueryData(FAVORITES_QUERY_KEY, (old = []) =>
        old.map((f) =>
          f.movie_id === movieId ? { ...f, personal_rating: rating } : f
        )
      );

      return { previousFavorites };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(FAVORITES_QUERY_KEY, context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
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
