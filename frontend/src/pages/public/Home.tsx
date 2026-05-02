import { ArrowRight, Github, Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { portfolioApi } from '../../api/portfolioApi';
import { EmptyState } from '../../components/EmptyState';
import { Loading } from '../../components/Loading';
import { Tecnologias } from '../../components/Tecnologias';
import type { Perfil, Projeto } from '../../types/api';

const heroImage =
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';

export function Home() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([portfolioApi.buscarPerfil(), portfolioApi.listarProjetos()])
      .then(([perfilResponse, projetosResponse]) => {
        setPerfil(perfilResponse);
        setProjetos(projetosResponse.filter((projeto) => projeto.destaque).slice(0, 3));
      })
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) {
    return <Loading />;
  }

  return (
    <>
      <section className="border-b border-tinta/10 bg-white">
        <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-cobre">{perfil?.cargo}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-tinta sm:text-5xl">
              {perfil?.nome}
            </h1>
            <p className="mt-5 text-base leading-8 text-tinta/75 sm:text-lg">{perfil?.resumo}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/portfolio" className="botao-primario">
                Ver projetos
                <ArrowRight size={18} />
              </Link>
              <Link to="/sobre" className="botao-secundario">
                Conhecer perfil
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Mesa de trabalho com codigo em notebook"
              className="h-[340px] w-full rounded-md object-cover shadow-painel sm:h-[460px]"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-md bg-white/95 p-4 shadow-painel">
              <p className="text-sm font-semibold text-tinta">Stack principal</p>
              <p className="mt-1 text-sm text-tinta/65">Java 21, Spring Boot, PostgreSQL, React e TypeScript</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-tinta">Projetos em destaque</h2>
            <p className="mt-2 text-sm text-tinta/70">Trabalhos recentes com foco em aplicacoes reais.</p>
          </div>
          <Link to="/portfolio" className="hidden text-sm font-bold text-cobre sm:inline-flex">
            Ver todos
          </Link>
        </div>

        {projetos.length === 0 ? (
          <EmptyState texto="Nenhum projeto em destaque cadastrado." />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {projetos.map((projeto) => (
              <article key={projeto.id} className="card p-5">
                <h3 className="text-lg font-bold text-tinta">{projeto.nome}</h3>
                <p className="mt-3 text-sm leading-6 text-tinta/70">{projeto.descricao}</p>
                <div className="mt-4">
                  <Tecnologias valor={projeto.tecnologias} />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={projeto.githubUrl} target="_blank" rel="noreferrer" className="botao-secundario px-3">
                    <Github size={16} />
                    GitHub
                  </a>
                  {projeto.deployUrl ? (
                    <a href={projeto.deployUrl} target="_blank" rel="noreferrer" className="botao-secundario px-3">
                      <Rocket size={16} />
                      Deploy
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
