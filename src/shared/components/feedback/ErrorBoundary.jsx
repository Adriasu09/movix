import { Component } from 'react';
import { ErrorState } from './ErrorState';
import copy from '@/config/copy.json';

// Única clase permitida en el proyecto (React requiere clase para este patrón).
// Envuelve subárboles críticos para mostrar un ErrorState en español
// en vez de una pantalla en blanco cuando algo explota inesperadamente.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Mensaje de diagnóstico para el dev — en inglés según CLAUDE.md §4.
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorState message={copy.messages.error} />;
    }
    return this.props.children;
  }
}
