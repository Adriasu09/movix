import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { Router } from '@/app/Router';

export const App = () => {
  return (
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  );
};
