import { Component } from 'react';
import { ErrorState } from './ErrorState';
import copy from '@/config/copy.json';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <ErrorState message={copy.messages.error} />;
    }
    return this.props.children;
  }
}
