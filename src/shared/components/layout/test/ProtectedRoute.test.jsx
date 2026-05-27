import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { vi } from 'vitest';
import copy from '@/config/copy.json';

/* ── Mocks ─────────────────────────────────────────────────────────── */
const mockUseSession = vi.fn();
vi.mock('@/features/auth/hooks/useSession', () => ({
  useSession: () => mockUseSession(),
}));

/* ── Import del componente (después de mocks) ───────────────────────── */
import { ProtectedRoute } from '@/shared/components/layout/ProtectedRoute';

/* ── Helpers ────────────────────────────────────────────────────────── */
// Sentinel para la ruta de sign-in: pinta el query param "from"
// para poder comprobar que la redirección lo añadió correctamente.
const SignInSentinel = () => {
  const location = useLocation();
  return <div data-testid="sign-in-page">sign-in | search={location.search}</div>;
};

const FavoritesContent = () => (
  <div data-testid="favorites-content">favorites-protected-content</div>
);

const renderProtected = () =>
  render(
    <MemoryRouter initialEntries={['/favorites']}>
      <Routes>
        <Route path="/sign-in" element={<SignInSentinel />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<FavoritesContent />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

/* ── Tests ──────────────────────────────────────────────────────────── */
describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseSession.mockReset();
  });

  /**
   * Scenario: Mostrar estado de carga mientras se resuelve la sesión
   *   Given la sesión aún se está cargando (isLoading=true)
   *   When el usuario navega a una ruta protegida
   *   Then se muestra el LoadingState
   *   And NO se renderiza el contenido protegido ni se redirige
   */
  it('muestra LoadingState mientras la sesión carga', () => {
    mockUseSession.mockReturnValue({ isLoading: true, isSignedIn: false });

    renderProtected();

    expect(screen.getByText(copy.messages.loading)).toBeInTheDocument();
    expect(screen.queryByTestId('favorites-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-page')).not.toBeInTheDocument();
  });

  /**
   * Scenario: Bloquear acceso a una ruta protegida sin autenticación
   *   Given el usuario NO está autenticado
   *   When intenta acceder a /favorites
   *   Then el sistema redirige a /sign-in
   *   And la URL incluye ?from=/favorites para volver tras autenticarse
   */
  it('redirige a /sign-in con ?from= cuando no hay sesión', () => {
    mockUseSession.mockReturnValue({ isLoading: false, isSignedIn: false });

    renderProtected();

    const signIn = screen.getByTestId('sign-in-page');
    expect(signIn).toBeInTheDocument();
    // El from debe apuntar a la ruta protegida original.
    expect(signIn.textContent).toContain('from=%2Ffavorites');
    expect(screen.queryByTestId('favorites-content')).not.toBeInTheDocument();
  });

  /**
   * Scenario: Permitir acceso a una ruta protegida con autenticación
   *   Given el usuario SÍ está autenticado
   *   When accede a /favorites
   *   Then se renderiza el Outlet (contenido protegido)
   *   And NO hay redirección a /sign-in
   */
  it('renderiza el Outlet cuando el usuario está autenticado', () => {
    mockUseSession.mockReturnValue({ isLoading: false, isSignedIn: true });

    renderProtected();

    expect(screen.getByTestId('favorites-content')).toBeInTheDocument();
    expect(screen.queryByTestId('sign-in-page')).not.toBeInTheDocument();
  });
});
