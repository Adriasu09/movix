import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('@/features/movies/hooks/useFeaturedMovies', () => ({
  useFeaturedMovies: () => ({
    data: [
      {
        id: 1,
        title: 'Inception',
        rating: 8.8,
        releaseYear: '2010',
        overview: 'Un ladrón roba secretos en sueños.',
        backdropUrl: 'https://image.tmdb.org/t/p/w1280/inception.jpg',
        genreIds: [28, 878],
      },
      {
        id: 2,
        title: 'Interstellar',
        rating: 8.6,
        releaseYear: '2014',
        overview: 'Un equipo busca un nuevo hogar entre las estrellas.',
        backdropUrl: 'https://image.tmdb.org/t/p/w1280/interstellar.jpg',
        genreIds: [12, 878],
      },
    ],
    isLoading: false,
  }),
}));

vi.mock('@/shared/hooks/useGenres', () => ({
  useGenres: () => ({
    data: [
      { id: 12, name: 'Aventura' },
      { id: 28, name: 'Acción' },
      { id: 878, name: 'Ciencia ficción' },
    ],
  }),
}));

import { HeroCarousel } from '@/features/movies/components/HeroCarousel';
import copy from '@/config/copy.json';

const renderHero = () =>
  render(
    <MemoryRouter>
      <HeroCarousel />
    </MemoryRouter>
  );

describe('HeroCarousel', () => {
  /**
   * Scenario: La primera slide se muestra por defecto
   *   Given hay películas destacadas
   *   When se renderiza HeroCarousel
   *   Then el título de la primera película es visible
   */
  it('muestra el título de la primera slide al cargar', () => {
    renderHero();
    expect(screen.getByRole('heading', { name: /inception/i })).toBeInTheDocument();
  });

  /**
   * Scenario: Click en el segundo dot cambia el slide visible
   *   Given el carrusel muestra la slide 1
   *   When el usuario pulsa el dot 2
   *   Then la slide 2 (Interstellar) reemplaza a la slide 1
   */
  it('cambia al segundo slide al pulsar su dot', () => {
    renderHero();

    // Hay tantos dots como slides (2 en este mock)
    const goToSlide2 = copy.explore.featured.goToSlideAria.replace('{n}', '2');
    const dot2 = screen.getByRole('button', { name: goToSlide2 });
    fireEvent.click(dot2);

    expect(screen.getByRole('heading', { name: /interstellar/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /inception/i })).not.toBeInTheDocument();
  });

  // Sanity: el CTA "Ver detalles" lleva al detalle de la película activa
  it('el CTA enlaza al detalle de la película visible', () => {
    renderHero();
    const cta = screen.getByRole('link', { name: copy.explore.featured.ctaLabel });
    expect(cta).toHaveAttribute('href', '/movies/1');
  });
});
