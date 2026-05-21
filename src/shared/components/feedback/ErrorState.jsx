import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import copy from "@/shared/constants/copy.json";

// Estado de error recuperable.
// API mínima:
//  - message: string localizado (lo produce el consumidor con parseApiError).
//    Si no se pasa, usa el genérico copy.messages.error.
//  - onRetry: si se pasa, muestra botón "Intentar de nuevo" que la llama.
export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
      <div className="bg-error/10 rounded-mvx-full p-md">
        <AlertCircle aria-hidden="true" className="text-error h-10 w-10" />
      </div>
      <div className="space-y-xs">
        <h3 className="text-text-primary font-display text-display-xs">
          {copy.messages.errorTitle}
        </h3>
        <p className="text-text-secondary text-main-sm max-w-sm">
          {message ?? copy.messages.error}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {copy.messages.retry}
        </Button>
      )}
    </div>
  );
};
