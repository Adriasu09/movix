export async function getFavorites(supabase, userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addFavorite(supabase, { userId, movie }) {
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      movie_id: movie.id,
      title: movie.title,
      poster_url: movie.posterUrl ?? null,
      release_year: movie.releaseYear ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFavorite(supabase, { userId, movieId }) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);

  if (error) throw error;
}

export async function updateRating(supabase, { userId, movieId, rating }) {
  if (rating !== null && (rating < 1 || rating > 10)) {
    throw new Error('Rating must be between 1 and 10');
  }

  const { data, error } = await supabase
    .from('favorites')
    .update({ personal_rating: rating })
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
