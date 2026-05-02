import { Award, BriefcaseBusiness, FolderKanban, Medal, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../api/portfolioApi';
import { Loading } from '../../components/Loading';
import { SectionHeader } from '../../components/SectionHeader';

type Indicador = {
  label: string;
  valor: number | string;
  to: string;
  descricao: string;
  icon: typeof UserRound;
};

export function AdminDashboard() {
  const [indicadores, setIndicadores] = useState<Indicador[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      portfolioApi.buscarPerfil(),
      portfolioApi.listarExperiencias(),
      portfolioApi.listarConquistas(),
      portfolioApi.listarCertificacoes(),
      portfolioApi.listarProjetos(),
    ])
      .then((resultados) => {
        const perfil = resultados[0].status === 'fulfilled' ? resultados[0].value : null;
        const experiencias = resultados[1].status === 'fulfilled' ? resultados[1].value : [];
        const conquistas = resultados[2].status === 'fulfilled' ? resultados[2].value : [];
        const certificacoes = resultados[3].status === 'fulfilled' ? resultados[3].value : [];
        const projetos = resultados[4].status === 'fulfilled' ? resultados[4].value : [];

        setIndicadores([
          { label: 'Perfil', valor: perfil ? 'OK' : 'Pendente', to: '/admin/perfil', descricao: 'Dados principais e links publicos', icon: UserRound },
          { label: 'Experiencias', valor: experiencias.length, to: '/admin/experiencias', descricao: 'Historico profissional', icon: BriefcaseBusiness },
          { label: 'Conquistas', valor: conquistas.length, to: '/admin/conquistas', descricao: 'Resultados relevantes', icon: Medal },
          { label: 'Certificacoes', valor: certificacoes.length, to: '/admin/certificacoes', descricao: 'Credenciais e cursos', icon: Award },
          { label: 'Projetos', valor: projetos.length, to: '/admin/projetos', descricao: 'Repositorios e deploys', icon: FolderKanban },
        ]);
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader titulo="Dashboard" texto="Resumo dos conteudos cadastrados no portfolio." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {indicadores.map((indicador) => {
          const Icon = indicador.icon;
          return (
            <Link key={indicador.label} to={indicador.to} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-painel">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-cobre/10 text-cobre">
                  <Icon size={19} />
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/70">
                  Ver
                </span>
              </div>
              <p className="mt-4 text-3xl font-bold text-tinta">{indicador.valor}</p>
              <p className="mt-1 text-sm font-semibold text-tinta/60">{indicador.label}</p>
              <p className="mt-2 text-xs leading-5 text-tinta/55">{indicador.descricao}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
