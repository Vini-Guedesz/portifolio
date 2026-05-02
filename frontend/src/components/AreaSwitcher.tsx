import { NavLink } from 'react-router-dom';

type AreaSwitcherProps = {
  modoAtual: 'publico' | 'admin';
  publicoTo: string;
  adminTo: string;
};

export function AreaSwitcher({ modoAtual, publicoTo, adminTo }: AreaSwitcherProps) {
  return (
    <div className="fixed bottom-5 right-4 z-40">
      <div className="rounded-md border border-white/15 bg-[#101817]/90 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="mb-1 px-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Alternar area</div>
        <div className="flex items-center gap-1">
          <NavLink
            to={publicoTo}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
              modoAtual === 'publico' ? 'bg-emerald-300/18 text-emerald-100' : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            Publico
          </NavLink>
          <NavLink
            to={adminTo}
            className={`rounded-md px-3 py-1.5 text-xs font-bold transition ${
              modoAtual === 'admin' ? 'bg-amber-300/18 text-amber-100' : 'text-white/65 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            Admin
          </NavLink>
        </div>
      </div>
    </div>
  );
}
