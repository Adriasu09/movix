import { render, screen } from "@testing-library/react";
import { WelcomeNavbar } from "@/shared/components/layout/WelcomeNavbar";

/**
 * Scenario: La navbar de bienvenida muestra la marca
 *   Given el usuario abre la pantalla de bienvenida
 *   When se renderiza la navbar
 *   Then se muestra el nombre "Movix"
 */
describe("WelcomeNavbar", () => {
  it("muestra la marca Movix", () => {
    render(<WelcomeNavbar />);
    expect(screen.getByText("Movix")).toBeInTheDocument();
  });
});
