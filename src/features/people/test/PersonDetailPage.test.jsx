import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

/* ── Mocks ─────────────────────────────────────────────────────────── */
// Mock parcial: conservamos MemoryRouter/Routes/Route/useParams reales,
// solo interceptamos useNavigate para verificar la redirección a /404.
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockUsePerson = vi.fn();
const mockUsePersonCredits = vi.fn();
vi.mock('@/features/people/hooks/usePerson', () => ({
  usePerson: (...args) => mockUsePerson(...args),
  usePersonCredits: (...args) => mockUsePersonCredits(...args),
}));

/* ── Import del componente (después de mocks) ───────────────────────── */
import { PersonDetailPage } from '@/features/people/pages/PersonDetailPage';

/* ── Helpers ────────────────────────────────────────────────────────── */
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/people/123']}>
      <Routes>
        <Route path="/people/:id" element={<PersonDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('PersonDetailPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUsePerson.mockReset();
    mockUsePersonCredits.mockReset();
    mockUsePersonCredits.mockReturnValue({ data: { cast: [], crew: [] } });
  });

  /**
   * Scenario: Mostrar estado de carga en una ficha
   *   Given el usuario navega a la ficha de una persona
   *   When el sistema sigue recuperando los datos
   *   Then se muestra un skeleton (estado de carga)
   *   And NO se muestra el nombre de la persona
   */
  it('muestra el skeleton mientras carga', () => {
    mockUsePerson.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { container } = renderPage();

    // El skeleton no tiene texto que podamos buscar por role, pero sí
    // contiene divs con clases animate-pulse. Comprobamos que NO ha
    // renderizado el header con nombre.
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });

  /**
   * Scenario: Gestionar una URL inválida o entidad inexistente
   *   Given el usuario navega a /people/:id con un id que no existe (404)
   *   When la query falla con error.status === 404
   *   Then el sistema redirige a /404 (estado controlado de no encontrado)
   */
  it('redirige a /404 cuando la persona no existe (error.status=404)', async () => {
    const notFoundError = Object.assign(new Error('TMDB 404'), { status: 404 });
    mockUsePerson.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: notFoundError,
      refetch: vi.fn(),
    });

    renderPage();

    expect(mockNavigate).toHaveBeenCalledWith('/404', { replace: true });
  });

  /**
   * Scenario: Mostrar la ficha detallada con los datos de la persona
   *   Given la query devuelve correctamente los datos
   *   When se renderiza la página
   *   Then se muestra el nombre, biografía y sección de filmografía
   */
  it('renderiza el nombre y la biografía cuando hay datos', () => {
    mockUsePerson.mockReturnValue({
      data: {
        id: 123,
        name: 'Christopher Nolan',
        biography: 'Director británico-estadounidense.',
        birthday: '1970-07-30',
        deathday: null,
        placeOfBirth: 'London, England',
        profileUrl: '',
        profileUrlLarge: '',
        popularity: 9.2,
        knownForDepartment: 'Directing',
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Christopher Nolan' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Director británico-estadounidense.')
    ).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
