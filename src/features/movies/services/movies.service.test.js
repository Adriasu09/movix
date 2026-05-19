import { vi } from "vitest";

vi.mock("@/config/env", () => ({
  env: { TMDB_IMAGE_BASE_URL: "https://image.tmdb.org/t/p" },
}));
vi.mock("@/api/tmdb.client", () => ({ tmdbFetch: vi.fn() }));

import { tmdbFetch } from "@/api/tmdb.client";
import { discoverMovies } from "@/features/movies/services/movies.service";

/**
 * Scenario: discoverMovies devuelve datos ya adaptados
 *   Given el cliente HTTP responde con una página de TMDB
 *   When se llama a discoverMovies
 *   Then se devuelve el modelo interno paginado y se piden los params correctos
 */
describe("discoverMovies (smoke)", () => {
  it("adapta la respuesta y llama al endpoint con los params esperados", async () => {
    tmdbFetch.mockResolvedValue({
      page: 1,
      total_pages: 5,
      total_results: 100,
      results: [{ id: 11, title: "Inception", poster_path: "/p.jpg" }],
    });

    const res = await discoverMovies();

    expect(res).toMatchObject({ page: 1, totalPages: 5, totalResults: 100 });
    expect(res.results[0]).toMatchObject({
      id: 11,
      title: "Inception",
      posterUrl: "https://image.tmdb.org/t/p/w342/p.jpg",
    });

    const [path, options] = tmdbFetch.mock.calls[0];
    expect(path).toBe("/discover/movie");
    expect(options.params["vote_count.gte"]).toBe(50);
    expect(options.params.sort_by).toBe("popularity.desc");
  });
});
