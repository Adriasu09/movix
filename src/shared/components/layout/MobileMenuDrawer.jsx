import { useEffect } from "react";
import { X } from "lucide-react";
import { AppNav } from "@/shared/components/layout/AppNav";
import copy from "@/config/copy.json";

export const MobileMenuDrawer = ({ isOpen, onClose }) => {
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
      <div aria-hidden="true" onClick={onClose} className="bg-bg-overlay fixed inset-0 z-40" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={copy.nav.openMenuAria}
        className="bg-bg-card fixed inset-y-0 left-0 z-50 flex w-72 flex-col p-lg"
      >
        <div className="flex items-center justify-between pb-xl">
          <span className="font-display text-gold-500 text-display-xs">{copy.appName}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.nav.closeMenuAria}
            className="text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-mvx-sm p-xs transition-colors"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <AppNav orientation="vertical" onLinkClick={onClose} />
      </aside>
    </>
  );
};
