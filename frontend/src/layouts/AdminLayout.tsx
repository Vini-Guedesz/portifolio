import { Award, BriefcaseBusiness, ChevronRight, FolderKanban, Home, LayoutDashboard, LogOut, Medal, UserRound } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AreaSwitcher } from '../components/AreaSwitcher';
import { useAuth } from '../contexts/AuthContext';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/perfil', label: 'Perfil', icon: UserRound },
  { to: '/admin/experiencias', label: 'Experiencias', icon: BriefcaseBusiness },
  { to: '/admin/conquistas', label: 'Conquistas', icon: Medal },
  { to: '/admin/certificacoes', label: 'Certificacoes', icon: Award },
  { to: '/admin/projetos', label: 'Projetos', icon: FolderKanban },
];

export function AdminLayout() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const linkAtivo = links.find((link) => location.pathname.startsWith(link.to));
  const tituloPagina = linkAtivo?.label ?? 'Painel';

  function sair() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell public-shell min-h-screen text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0b1412]/88 backdrop-blur lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Area administrativa</p>
            <p className="mt-2 break-all text-xs text-white/50">{email}</p>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                      isActive
                        ? 'border border-emerald-300/30 bg-emerald-300/12 text-emerald-100'
                        : 'border border-transparent text-white/58 hover:bg-white/[0.06] hover:text-white'
                    }`
                  }
                >
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="space-y-2 border-t border-white/10 p-3">
            <NavLink to="/" className="botao-secundario w-full justify-start">
              <Home size={16} />
              Ver site
            </NavLink>
            <button type="button" className="botao-secundario w-full justify-start" onClick={sair}>
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b1412]/90 backdrop-blur">
          <div className="container-page flex items-center justify-between gap-3 py-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-300">Area administrativa</p>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-white/60">
                <span>Admin</span>
                <ChevronRight size={14} />
                <span className="font-semibold text-white">{tituloPagina}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <NavLink to="/" className="botao-secundario hidden px-3 sm:inline-flex">
                <Home size={16} />
                Ver site
              </NavLink>
              <button type="button" className="botao-secundario px-3" onClick={sair}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>

          <nav className="scrollbar-admin flex gap-2 overflow-x-auto border-t border-white/10 px-4 pb-3 pt-3 lg:hidden">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${
                      isActive ? 'bg-emerald-300/14 text-emerald-100' : 'bg-white/[0.06] text-white/65'
                    }`
                  }
                >
                  <Icon size={16} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </header>

        <main className="container-page py-8 lg:py-10">
          <Outlet />
        </main>
      </div>

      <AreaSwitcher modoAtual="admin" publicoTo="/" adminTo="/admin/dashboard" />
    </div>
  );
}
