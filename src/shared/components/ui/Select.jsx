import { ChevronDown } from "lucide-react";

// Primitivo del DS para selects desplegables.
// Wrapper accesible de `<select>` HTML nativo — el panel desplegado es el
// nativo del navegador (a11y y teclado vienen gratis), pero el botón en sí
// va estilizado con tokens del DS.
//
// Por qué nativo y no custom:
//   - Cero código de keyboard nav, focus trap o close on outside click.
//   - A11y y SSR-friendly por defecto.
//   - Acordado con la usuaria — el ligero look diferente entre navegadores/SO
//     en el panel desplegado se considera aceptable.
//
// Props:
//   options  – Array<{ value: string, label: string }>
//   value    – valor actual (se pasa directo al <select>)
//   onChange – handler estándar de input (recibe e.target.value)
//   className – override puntual de estilos
//   ...props – todo lo demás (aria-label, name, disabled, etc.)
const BASE =
  "appearance-none bg-bg-muted border border-border-default rounded-mvx-md " +
  "pl-md pr-2xl py-xs text-text-secondary text-main-sm font-medium " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 " +
  "transition-colors cursor-pointer hover:border-border-strong";

export const Select = ({ options = [], className = "", ...props }) => {
  return (
    <div className="relative inline-block">
      <select {...props} className={`${BASE} ${className}`}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Flecha custom — `appearance-none` esconde la nativa */}
      <ChevronDown
        aria-hidden="true"
        className="text-text-secondary pointer-events-none absolute right-sm top-1/2 h-4 w-4 -translate-y-1/2"
      />
    </div>
  );
};
