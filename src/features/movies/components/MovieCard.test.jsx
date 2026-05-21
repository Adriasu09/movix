import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MovieCard } from "@/features/movies/components/MovieCard";
import copy from "@/shared/constants/copy.json";

// Envuelve en MemoryRouter porque MovieCard usa <Link>
const renderCard = (movie) =>
  render(
    <MemoryRouter>
      <ul>
        <MovieCard movie={movie} />
      </ul>
    </MemoryRouter>
  );

const baseMovie = {
  id: 42,
  title: "Inception",
  releaseYear: "2010",
  rating: 8.8,
  posterUrl: "https://image.tmdb.org/t/p/w342/poster.jpg",
};

/**
 * Scenario: Renderizar título y año correctamente
 *   Given una película con título "Inception" y año "2010"
 *   When se renderiza MovieCard
 *   Then el título y el año son visibles en el documento
 */
describe("MovieCard", () => {
  it("muestra el título y el año de la película", () => {
    renderCard(baseMovie);

    expect(screen.getByRole("heading", { name: /inception/i })).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
  });

  /**
   * Scenario: Mostrar fallback cuando no hay póster
   *   Given una película sin posterUrl (null o vacío)
   *   When se renderiza MovieCard
   *   Then se muestra el texto de fallback del copy
   */
  it("muestra el texto fallback cuando no hay póster", () => {
    renderCard({ ...baseMovie, posterUrl: null });

    expect(screen.getByText(copy.messages.noPoster)).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  /**
   * Scenario: El enlace apunta a la ruta correcta
   *   Given una película con id 42
   *   When se renderiza MovieCard
   *   Then el enlace principal apunta a "/movies/42"
   */
  it("enlaza a la ruta de detalle de la película", () => {
    renderCard(baseMovie);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/movies/42");
  });
});
