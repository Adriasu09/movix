import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { Router } from '@/app/Router';
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary';

export const App = () => {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
};
