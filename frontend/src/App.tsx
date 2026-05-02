import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { portfolioApi } from './api/portfolioApi';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { AdminCertificacoes } from './pages/admin/AdminCertificacoes';
import { AdminConquistas } from './pages/admin/AdminConquistas';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminExperiencias } from './pages/admin/AdminExperiencias';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminPerfil } from './pages/admin/AdminPerfil';
import { AdminPrimeiroAcesso } from './pages/admin/AdminPrimeiroAcesso';
import { AdminProjetos } from './pages/admin/AdminProjetos';
import { Portfolio } from './pages/public/Portfolio';
import { Sobre } from './pages/public/Sobre';

function PublicRedirect({ secao = 'sobre' }: { secao?: 'sobre' | 'portfolio' }) {
  const [destino, setDestino] = useState<string | null>(null);

  useEffect(() => {
    portfolioApi
      .buscarPerfil()
      .then((perfil) => setDestino(`/${perfil.username}/${secao}`))
      .catch(() => setDestino(`/usuario/${secao}`));
  }, [secao]);

  if (!destino) {
    return null;
  }

  return <Navigate to={destino} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicRedirect />} />
      <Route path="/sobre" element={<PublicRedirect secao="sobre" />} />
      <Route path="/portfolio" element={<PublicRedirect secao="portfolio" />} />

      <Route element={<PublicLayout />}>
        <Route path="/:usuario" element={<Navigate to="sobre" replace />} />
        <Route path="/:usuario/sobre" element={<Sobre />} />
        <Route path="/:usuario/portfolio" element={<Portfolio />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin/primeiro-acesso" element={<AdminPrimeiroAcesso />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/perfil" element={<AdminPerfil />} />
          <Route path="/admin/experiencias" element={<AdminExperiencias />} />
          <Route path="/admin/conquistas" element={<AdminConquistas />} />
          <Route path="/admin/certificacoes" element={<AdminCertificacoes />} />
          <Route path="/admin/projetos" element={<AdminProjetos />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
