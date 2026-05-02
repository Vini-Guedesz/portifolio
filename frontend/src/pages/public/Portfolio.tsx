import { Github, Rocket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { portfolioApi } from '../../api/portfolioApi';
import { EmptyState } from '../../components/EmptyState';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { Loading } from '../../components/Loading';
import { Tecnologias } from '../../components/Tecnologias';
import type { Projeto } from '../../types/api';

type ProjetoCard = {
  id: string;
  nome: string;
  descricao: string;
  tecnologias: string;
  githubUrl: string;
  deployUrl: string | null;
}

function mapearProjetosAdmin(projetos: Projeto[]): ProjetoCard[] {
  return projetos.map((projeto) => ({
    id: `admin-${projeto.id}`,
    nome: projeto.nome,
    descricao: projeto.descricao,
    tecnologias: projeto.tecnologias,
    githubUrl: projeto.githubUrl,
    deployUrl: projeto.deployUrl,
  }));
}

export function Portfolio() {
  const [projetos, setProjetos] = useState<ProjetoCard[]>([]);
  const [filtroTecnologia, setFiltroTecnologia] = useState<string>('Todas');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      const projetosAdmin = await portfolioApi.listarProjetos();
      setProjetos(mapearProjetosAdmin(projetosAdmin));
    }

    carregar().finally(() => setCarregando(false));
  }, []);

  useRevealOnScroll([carregando, filtroTecnologia]);

  const tecnologiasDisponiveis = useMemo(() => {
    const setTecnologias = new Set<string>();
    projetos.forEach((projeto) => {
      projeto.tecnologias
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((tecnologia) => setTecnologias.add(tecnologia));
    });
    return ['Todas', ...Array.from(setTecnologias).sort((a, b) => a.localeCompare(b))];
  }, [projetos]);

  const projetosFiltrados = useMemo(() => {
    if (filtroTecnologia === 'Todas') {
      return projetos;
    }
    return projetos.filter((projeto) =>
      projeto.tecnologias
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .includes(filtroTecnologia.toLowerCase()),
    );
  }, [projetos, filtroTecnologia]);

  if (carregando) {
    return <Loading escuro />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <section className="grid gap-5 border-b border-white/10 pb-9 md:grid-cols-[0.8fr_0.2fr] md:items-end" data-reveal>
        <div>
          <p className="public-kicker">Portfolio</p>
          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">Projetos publicados</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
          Cards com nome, descricao, tecnologias e link direto para o repositorio.
          </p>
        </div>
        <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4 text-right">
          <p className="text-3xl font-black text-emerald-100">{projetosFiltrados.length}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">Projetos</p>
        </div>
      </section>

      <div className="public-divider my-9">Projetos cadastrados</div>
      <section className="mb-8" data-reveal style={{ ['--reveal-delay' as never]: '80ms' }}>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-white/50">Filtrar por tecnologia</p>
        <div className="flex flex-wrap gap-2">
          {tecnologiasDisponiveis.map((tecnologia) => (
            <button
              key={tecnologia}
              type="button"
              onClick={() => setFiltroTecnologia(tecnologia)}
              className={`rounded-md border px-3 py-1.5 text-xs font-bold transition ${
                filtroTecnologia === tecnologia
                  ? 'border-amber-300/45 bg-amber-300/12 text-amber-100'
                  : 'border-white/10 bg-white/[0.04] text-white/65 hover:border-white/25 hover:text-white'
              }`}
            >
              {tecnologia}
            </button>
          ))}
        </div>
      </section>

      {projetosFiltrados.length === 0 ? (
        <EmptyState texto="Nenhum projeto encontrado para esse filtro." escuro />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {projetosFiltrados.map((projeto, index) => (
            <article
              key={projeto.id}
              className="public-card public-interactive flex min-h-72 flex-col p-6 transition hover:border-emerald-300/40"
              data-reveal
              style={{ ['--reveal-delay' as never]: `${Math.min(index * 50, 240)}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-white">{projeto.nome}</h2>
              </div>

              <p className="mt-4 flex-1 text-sm leading-7 text-white/68">{projeto.descricao}</p>

              <div className="mt-5">
                <Tecnologias valor={projeto.tecnologias} escuro />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={projeto.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-emerald-300/35 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/20"
                >
                  <Github size={16} />
                  Repositorio
                </a>
                {projeto.deployUrl ? (
                  <a
                    href={projeto.deployUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-amber-300 px-4 py-2 text-sm font-bold text-[#11130f] transition hover:bg-amber-200"
                  >
                    <Rocket size={16} />
                    Deploy
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
