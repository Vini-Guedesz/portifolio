import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { autenticado, precisaAlterarCredenciais, carregandoSessao } = useAuth();
  const location = useLocation();

  if (carregandoSessao) {
    return null;
  }

  if (!autenticado) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const naRotaPrimeiroAcesso = location.pathname === '/admin/primeiro-acesso';
  if (precisaAlterarCredenciais && !naRotaPrimeiroAcesso) {
    return <Navigate to="/admin/primeiro-acesso" replace />;
  }
  if (!precisaAlterarCredenciais && naRotaPrimeiroAcesso) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
