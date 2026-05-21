import { useEffect } from "react";
import { X } from "lucide-react";
import { AppNav } from "@/shared/components/layout/AppNav";
import copy from "@/config/copy.json";

// Drawer lateral desplegado al pulsar el hamburger del header en mobile.
// Reutiliza AppNav en orientación vertical para no duplicar la lista de links.
// El `onClose` se pasa también a AppNav.onLinkClick → al navegar el drawer cierra.
//
// Cierre por 3 vías:
//   - Click en el botón ✕
//   - Click en el backdrop (afuera del panel)
//   - Tecla Escape (a11y)
//
// Props:
//   isOpen  – si false, no renderiza nada (no consume DOM)
//   onClose – callback para cerrar (el padre maneja el estado abierto/cerrado)
export const MobileMenuDrawer = ({ isOpen, onClose }) => {
  // Escape cierra el drawer (no depende del foco para funcionar)
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop: click cierra. aria-hidden porque el panel ya tiene aria-modal */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="bg-bg-overlay fixed inset-0 z-40"
      />

      {/* Panel deslizante desde la izquierda */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={copy.nav.openMenuAria}
        className="bg-bg-card fixed inset-y-0 left-0 z-50 flex w-72 flex-col p-lg"
      >
        {/* Header del drawer: logo + botón cerrar */}
        <div className="flex items-center justify-between pb-xl">
          <span className="font-display text-gold-500 text-display-xs">
            {copy.appName}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.nav.closeMenuAria}
            className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-mvx-sm p-xs transition-colors"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {/* Lista vertical de links — onLinkClick cierra el drawer al navegar */}
        <AppNav orientation="vertical" onLinkClick={onClose} />
      </aside>
    </>
  );
};
