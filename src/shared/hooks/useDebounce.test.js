import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useDebounce } from "@/shared/hooks/useDebounce";

/**
 * Scenario: Debounce retrasa la actualización del valor
 *   Given un valor que cambia
 *   When pasan menos de `delay` ms entre cambios
 *   Then el valor debounceado mantiene el último estable hasta cumplir el delay
 */
describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("devuelve el valor inicial sin esperar", () => {
    const { result } = renderHook(() => useDebounce("a", 400));
    expect(result.current).toBe("a");
  });

  it("actualiza al valor nuevo tras pasar el delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(result.current).toBe("b");
  });

  it("cancela el timer si el valor cambia antes del delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 400), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Aún no han pasado 400ms desde "c"
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    // Ahora sí ha pasado el delay completo desde el último cambio
    expect(result.current).toBe("c");
  });
});
