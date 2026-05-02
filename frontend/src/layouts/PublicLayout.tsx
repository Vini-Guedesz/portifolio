import { Menu } from 'lucide-react';
import { NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { AreaSwitcher } from '../components/AreaSwitcher';
import { useAuth } from '../contexts/AuthContext';

export function PublicLayout() {
  const { autenticado, precisaAlterarCredenciais } = useAuth();
  const location = useLocation();
  const { usuario = 'usuario' } = useParams();
  const rotaAdmin = precisaAlterarCredenciais ? '/admin/primeiro-acesso' : '/admin/dashboard';
  const links = [
    { to: `/${usuario}/sobre`, label: 'Sobre' },
    { to: `/${usuario}/portfolio`, label: 'Portfolio' },
  ];

  return (
    <div className="public-shell min-h-screen text-white">
      <header className="fixed left-0 right-0 top-5 z-20 px-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-center">
          <nav className="hidden items-center gap-2 rounded-md border border-white/12 bg-[#101817]/82 p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.38)] backdrop-blur sm:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-6 py-2.5 text-sm font-bold uppercase tracking-[0.08em] transition ${
                    isActive
                      ? 'border border-amber-300/45 bg-amber-300/12 text-amber-100 shadow-[0_0_28px_rgba(252,211,77,0.16)]'
                      : 'border border-transparent text-white/58 hover:bg-white/[0.06] hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <details className="relative sm:hidden">
            <summary className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border border-white/15 bg-[#101817]/88 text-white shadow-[0_16px_40px_rgba(0,0,0,0.32)] backdrop-blur">
              <Menu size={18} />
            </summary>
            <div className="absolute left-1/2 mt-2 w-48 -translate-x-1/2 rounded-md border border-white/10 bg-[#101817] p-2 shadow-painel">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className="block rounded-md px-3 py-2 text-sm font-semibold text-white/80">
                  {link.label}
                </NavLink>
              ))}
            </div>
          </details>
        </div>
      </header>

      <main className="pt-20">
        <div key={location.pathname} className="public-route-transition">
          <Outlet />
        </div>
      </main>

      <NavLink
        to={`/${usuario}/sobre#contato`}
        className="fixed bottom-5 left-4 z-30 inline-flex items-center gap-2 rounded-md border border-amber-300/30 bg-[#101817]/88 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-amber-100 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:border-amber-300/50 hover:bg-amber-300/12"
      >
        Falar comigo
      </NavLink>

      {autenticado ? (
        <AreaSwitcher modoAtual="publico" publicoTo={`/${usuario}/sobre`} adminTo={rotaAdmin} />
      ) : null}
    </div>
  );
}
