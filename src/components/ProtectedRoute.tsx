// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useBlog } from '@/context/BlogContext';

interface Props {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: Props) => {
  const { token } = useBlog();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
