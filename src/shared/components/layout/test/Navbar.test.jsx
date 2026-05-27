import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Navbar usa <SignedIn>, <SignedOut> y <UserButton> de Clerk directamente.
// Sin ClerkProvider explotan en tests — los sustituimos por stubs que
// simulan el estado "usuario no autenticado" (SignedOut renderiza sus hijos).
vi.mock('@clerk/clerk-react', () => ({
  SignedIn: () => null,
  SignedOut: ({ children }) => children,
  UserButton: () => null,
}));

import { Navbar } from '@/shared/components/layout/Navbar';
import copy from '@/config/copy.json';

const renderNavbar = (variant) =>
  render(
    <MemoryRouter>
      <Navbar variant={variant} />
    </MemoryRouter>
  );

describe('Navbar', () => {
  /**
   * Scenario: La variante "welcome" no muestra hamburger ni nav links
   *   Given variant="welcome"
   *   When se renderiza Navbar
   *   Then NO existe el botón hamburger
   *   And NO existe la nav principal
   */
  it("en variant='welcome' no renderiza hamburger ni nav", () => {
    renderNavbar('welcome');

    expect(screen.queryByRole('button', { name: copy.nav.openMenuAria })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('navigation', { name: /navegación principal/i })
    ).not.toBeInTheDocument();
  });

  /**
   * Scenario: La variante "app" expone hamburger y la nav
   *   Given variant="app"
   *   When se renderiza Navbar
   *   Then existe el botón hamburger (visible en mobile, oculto en desktop por CSS)
   *   And existe la nav principal en el DOM
   */
  it("en variant='app' renderiza hamburger y nav", () => {
    renderNavbar('app');

    expect(screen.getByRole('button', { name: copy.nav.openMenuAria })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /navegación principal/i })).toBeInTheDocument();
  });

  // Sanity: el botón Sign In aparece en ambas variantes (placeholder visual)
  it("muestra el botón 'Iniciar sesión' en ambas variantes", () => {
    const { unmount } = renderNavbar('welcome');
    expect(screen.getByRole('button', { name: copy.auth.signIn })).toBeInTheDocument();
    unmount();

    renderNavbar('app');
    expect(screen.getByRole('button', { name: copy.auth.signIn })).toBeInTheDocument();
  });
});
