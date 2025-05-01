import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// const isDevelopment = false;
// // const isDevelopment = import.meta.env.MODE === 'development';

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // if (isDevelopment) {
  //   return <>{children}</>;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
