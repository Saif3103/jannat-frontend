import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function AdminRoute() {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
