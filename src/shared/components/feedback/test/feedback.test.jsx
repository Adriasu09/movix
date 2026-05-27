import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import copy from '@/config/copy.json';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { EndOfResults } from '@/shared/components/feedback/EndOfResults';

/**
 * Estos componentes representan los estados FUS "Gestión de estados de
 * carga, vacío, fin de resultados y error" — comunes a las épicas de
 * exploración, fichas y favoritas. Un smoke test transversal cubre que
 * cumplen su contrato visible.
 */
describe('Componentes de feedback (smoke)', () => {
  /**
   * Scenario: Mostrar estado vacío
   *   Given el sistema no encuentra resultados
   *   When se renderiza EmptyState con título y descripción
   *   Then se muestran ambos textos
   */
  it('EmptyState muestra título y descripción', () => {
    render(<EmptyState title="Sin resultados" description="Prueba con otros filtros." />);

    expect(screen.getByRole('heading', { name: 'Sin resultados' })).toBeInTheDocument();
    expect(screen.getByText('Prueba con otros filtros.')).toBeInTheDocument();
  });

  /**
   * Scenario: Mostrar error recuperable y permitir reintento
   *   Given el sistema no puede recuperar los datos
   *   When se renderiza ErrorState con onRetry
   *   Then se muestra el mensaje y el botón "Intentar de nuevo"
   *   And pulsar el botón dispara la callback onRetry
   */
  it('ErrorState muestra el mensaje y dispara onRetry al pulsar', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Falló la carga" onRetry={onRetry} />);

    expect(screen.getByText('Falló la carga')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: copy.messages.retry });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  /**
   * Scenario: Mostrar fin de resultados
   *   Given el usuario ha llegado al final del listado paginado
   *   When se renderiza EndOfResults sin props
   *   Then se muestra el mensaje por defecto del copy.json
   */
  it('EndOfResults muestra el mensaje de fin de resultados por defecto', () => {
    render(<EndOfResults />);
    expect(screen.getByText(copy.messages.endOfResults)).toBeInTheDocument();
  });
});
