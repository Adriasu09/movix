import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from '@/api/useSupabase';
import { useSession } from '@/features/auth/hooks/useSession';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  updateRating,
} from '../services/favorites.service';

// Cache aislada por usuario: evita contaminar resultados si cambia la sesión sin recarga.
export const favoritesQueryKey = (userId) => ['favorites', userId];

export function useFavorites() {
  const supabase = useSupabase();
  const { user, isSignedIn } = useSession();
  const queryClient = useQueryClient();
  const userId = user?.id;
  const queryKey = favoritesQueryKey(userId);

  const query = useQuery({
    queryKey,
    queryFn: () => getFavorites(supabase, userId),
    enabled: isSignedIn && !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const addMutation = useMutation({
    mutationFn: (movie) => addFavorite(supabase, { userId, movie }),

    onMutate: async (movie) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFavorites = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) => [
        {
          id: `temp-${movie.id}`,
          user_id: userId,
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
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (movieId) => removeFavorite(supabase, { userId, movieId }),

    onMutate: async (movieId) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFavorites = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) => old.filter((f) => f.movie_id !== movieId));

      return { previousFavorites };
    },

    onError: (_err, _movieId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateRatingMutation = useMutation({
    mutationFn: ({ movieId, rating }) => updateRating(supabase, { userId, movieId, rating }),

    onMutate: async ({ movieId, rating }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFavorites = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((f) => (f.movie_id === movieId ? { ...f, personal_rating: rating } : f))
      );

      return { previousFavorites };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
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
