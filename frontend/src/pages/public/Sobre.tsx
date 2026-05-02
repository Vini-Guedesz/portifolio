import {
  ChevronDown,
  ArrowUpRight,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  FolderKanban,
  Github,
  Linkedin,
  Mail,
  Medal,
  Send,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { portfolioApi } from '../../api/portfolioApi';
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll';
import { Loading } from '../../components/Loading';
import type { Certificacao, Conquista, Experiencia, Perfil } from '../../types/api';
import { formatarData, periodo } from '../../utils/formatters';

type ContatoCard = {
  titulo: string;
  descricao: string;
  href: string;
  icon: typeof Mail;
};

const particulas = [
  { top: '8%', left: '12%', delay: '0s', duration: '6.4s' },
  { top: '14%', left: '78%', delay: '1s', duration: '7.2s' },
  { top: '24%', left: '52%', delay: '0.5s', duration: '6.8s' },
  { top: '31%', left: '20%', delay: '1.8s', duration: '7.6s' },
  { top: '39%', left: '86%', delay: '0.9s', duration: '6.2s' },
  { top: '47%', left: '64%', delay: '1.5s', duration: '7s' },
  { top: '58%', left: '8%', delay: '0.7s', duration: '6.5s' },
  { top: '67%', left: '36%', delay: '1.2s', duration: '7.4s' },
  { top: '73%', left: '74%', delay: '0.4s', duration: '6.7s' },
  { top: '82%', left: '18%', delay: '1.4s', duration: '7.1s' },
  { top: '88%', left: '57%', delay: '0.3s', duration: '6.3s' },
  { top: '92%', left: '90%', delay: '1.9s', duration: '7.5s' },
];

function iniciais(nome?: string) {
  return (nome ?? 'P')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join('')
    .toUpperCase();
}

function resolverUrlMidia(url?: string | null) {
  if (!url) {
    return null;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseApi = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:8080';
  const caminho = url.startsWith('/') ? url : `/${url}`;
  return `${baseApi}${caminho}`;
}

export function Sobre() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [certificacoes, setCertificacoes] = useState<Certificacao[]>([]);
  const [projetosTotal, setProjetosTotal] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [deslocamentoHero, setDeslocamentoHero] = useState(0);
  const [mostrarIndicadorScroll, setMostrarIndicadorScroll] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      portfolioApi.buscarPerfil(),
      portfolioApi.listarExperiencias(),
      portfolioApi.listarConquistas(),
      portfolioApi.listarCertificacoes(),
      portfolioApi.listarProjetos(),
    ])
      .then((resultados) => {
        setPerfil(resultados[0].status === 'fulfilled' ? resultados[0].value : null);
        setExperiencias(resultados[1].status === 'fulfilled' ? resultados[1].value : []);
        setConquistas(resultados[2].status === 'fulfilled' ? resultados[2].value : []);
        setCertificacoes(resultados[3].status === 'fulfilled' ? resultados[3].value : []);
        setProjetosTotal(resultados[4].status === 'fulfilled' ? resultados[4].value.length : 0);
      })
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    function atualizarParallax() {
      const deslocamento = Math.min(window.scrollY * 0.18, 38);
      setDeslocamentoHero(deslocamento);
    }

    atualizarParallax();
    window.addEventListener('scroll', atualizarParallax, { passive: true });
    return () => window.removeEventListener('scroll', atualizarParallax);
  }, []);

  useEffect(() => {
    if (carregando) {
      setMostrarIndicadorScroll(false);
      return;
    }

    function atualizarIndicadorScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const alturaDocumento = document.documentElement.scrollHeight;
      const alturaJanela = window.innerHeight;
      const restante = alturaDocumento - (scrollTop + alturaJanela);
      setMostrarIndicadorScroll(restante > 20);
    }

    atualizarIndicadorScroll();
    const raf = requestAnimationFrame(atualizarIndicadorScroll);
    const timeout = window.setTimeout(atualizarIndicadorScroll, 120);
    window.addEventListener('scroll', atualizarIndicadorScroll, { passive: true });
    window.addEventListener('resize', atualizarIndicadorScroll);
    window.addEventListener('load', atualizarIndicadorScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timeout);
      window.removeEventListener('scroll', atualizarIndicadorScroll);
      window.removeEventListener('resize', atualizarIndicadorScroll);
      window.removeEventListener('load', atualizarIndicadorScroll);
    };
  }, [carregando]);

  useRevealOnScroll([carregando]);

  const contatos = useMemo<ContatoCard[]>(
    () =>
      [
        perfil?.emailContato
          ? {
              titulo: 'Email',
              descricao: perfil.emailContato,
              href: `mailto:${perfil.emailContato}`,
              icon: Mail,
            }
          : null,
        perfil?.linkedinUrl
          ? {
              titulo: 'LinkedIn',
              descricao: 'Perfil profissional',
              href: perfil.linkedinUrl,
              icon: Linkedin,
            }
          : null,
        perfil?.githubUrl
          ? {
              titulo: 'GitHub',
              descricao: 'Repositorios e codigo',
              href: perfil.githubUrl,
              icon: Github,
            }
          : null,
        perfil?.xUrl
          ? {
              titulo: 'X',
              descricao: 'Publicacoes tecnicas',
              href: perfil.xUrl,
              icon: X,
            }
          : null,
        perfil?.tiktokUrl
          ? {
              titulo: 'TikTok',
              descricao: 'Conteudo e rotina',
              href: perfil.tiktokUrl,
              icon: Send,
            }
          : null,
      ].filter((contato): contato is ContatoCard => Boolean(contato)),
    [perfil],
  );

  const palavrasChave = useMemo(() => {
    if (!perfil?.palavrasChave) {
      return [];
    }
    return perfil.palavrasChave
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .slice(0, 8);
  }, [perfil?.palavrasChave]);

  const anosExperiencia = useMemo(() => {
    if (experiencias.length === 0) {
      return 0;
    }
    const dataMaisAntiga = experiencias
      .map((item) => new Date(item.dataInicio).getTime())
      .filter((time) => !Number.isNaN(time))
      .sort((a, b) => a - b)[0];
    if (!dataMaisAntiga) {
      return 0;
    }
    const anos = (Date.now() - dataMaisAntiga) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(1, Math.floor(anos));
  }, [experiencias]);

  if (carregando) {
    return <Loading escuro />;
  }

  return (
    <div className="relative isolate">
      <div className="sobre-fundo-animado" aria-hidden="true">
        {particulas.map((particula, index) => (
          <span
            key={`${particula.top}-${particula.left}-${index}`}
            className="sobre-fundo-particula"
            style={{ top: particula.top, left: particula.left, animationDelay: particula.delay, animationDuration: particula.duration }}
          />
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        <section className="grid items-start gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div className="relative mx-auto w-full max-w-sm lg:mx-0">
          <div
            className="absolute -left-5 top-8 h-28 w-28 rounded-md border border-amber-300/20 bg-amber-300/10"
            style={{ transform: `translateY(${Math.round(-deslocamentoHero * 0.35)}px)` }}
          />
          <div
            className="absolute -bottom-5 -right-5 h-32 w-32 rounded-md border border-emerald-300/20 bg-emerald-300/10"
            style={{ transform: `translateY(${Math.round(deslocamentoHero * 0.45)}px)` }}
          />

          <div
            className="relative overflow-hidden rounded-md border border-white/12 bg-[#111b19] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.42)]"
            style={{ transform: `translateY(${Math.round(-deslocamentoHero * 0.25)}px)` }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-md bg-[#16211f]">
              {perfil?.fotoUrl ? (
                <img src={resolverUrlMidia(perfil.fotoUrl) ?? undefined} alt={perfil.nome} className="h-full w-full object-cover grayscale-[18%]" />
              ) : (
                <span className="grid h-full w-full place-items-center text-5xl font-black text-emerald-100">
                  {iniciais(perfil?.nome)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="public-kicker">Perfil profissional</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">{perfil?.nome ?? 'Perfil nao cadastrado'}</h1>
          <p className="mt-4 text-lg font-semibold text-emerald-100/82">{perfil?.cargo ?? 'Acesse /admin/perfil para configurar.'}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-md border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-bold text-emerald-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              {perfil?.disponibilidade ?? 'Disponibilidade nao informada'}
            </span>
            {palavrasChave.map((palavra) => (
              <span key={palavra} className="public-chip">
                {palavra}
              </span>
            ))}
          </div>

          <div className="mt-8 border-l-2 border-amber-300/45 pl-5">
            <p className="text-sm leading-7 text-white/72">
              {perfil?.resumo ?? 'As informacoes publicas do perfil ainda nao foram preenchidas no painel administrativo.'}
            </p>
          </div>

        </div>
      </section>

      <section className="mt-7 grid gap-3 sm:grid-cols-3" data-reveal style={{ ['--reveal-delay' as never]: '80ms' }}>
        <article className="public-card public-interactive p-4">
          <p className="text-3xl font-black text-emerald-100">{anosExperiencia}+</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/55">Anos de experiencia</p>
        </article>
        <article className="public-card public-interactive p-4">
          <p className="text-3xl font-black text-emerald-100">{projetosTotal}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/55">Projetos publicados</p>
        </article>
        <article className="public-card public-interactive p-4">
          <p className="text-3xl font-black text-emerald-100">{certificacoes.length + conquistas.length}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/55">Conquistas e certificacoes</p>
        </article>
      </section>

      <div id="conteudo" className="scroll-mt-24" />

      <div className="relative">
        {contatos.length > 0 ? (
          <section id="contato" className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-reveal style={{ ['--reveal-delay' as never]: '90ms' }}>
            {contatos.map((contato) => {
              const Icon = contato.icon;
              return (
                <a
                  key={contato.titulo}
                  href={contato.href}
                  target={contato.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={contato.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                  className="group rounded-md border border-white/10 bg-white/[0.045] p-4 transition hover:-translate-y-0.5 hover:border-amber-300/40 hover:bg-white/[0.07] public-interactive"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-amber-300/12 text-amber-200">
                      <Icon size={19} />
                    </span>
                    <ArrowUpRight size={16} className="text-white/35 transition group-hover:text-amber-200" />
                  </div>
                  <p className="mt-4 text-sm font-black uppercase tracking-[0.08em] text-white">{contato.titulo}</p>
                  <p className="mt-1 truncate text-xs text-white/52">{contato.descricao}</p>
                </a>
              );
            })}
          </section>
        ) : null}

        {experiencias.length > 0 ? (
          <section className="mt-14" data-reveal style={{ ['--reveal-delay' as never]: '110ms' }}>
            <div className="public-divider mb-7">Experiencia</div>
            <div className="relative space-y-5 before:absolute before:left-4 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-emerald-300/25 sm:before:left-5">
              {experiencias.map((experiencia) => (
                <article key={experiencia.id} className="relative pl-12 sm:pl-16">
                  <span className="absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-md border border-emerald-300/35 bg-[#0c1714] text-emerald-200 sm:h-10 sm:w-10">
                    <BriefcaseBusiness size={18} />
                  </span>
                  <div className="rounded-md border border-white/10 bg-[#101817]/78 p-5 transition hover:border-emerald-300/40 public-interactive">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-black text-white">{experiencia.cargo}</h2>
                        <p className="mt-1 text-sm font-semibold text-emerald-200">{experiencia.empresa}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-md bg-white/[0.055] px-3 py-1.5 text-xs font-semibold text-white/58">
                        <CalendarDays size={14} />
                        {periodo(experiencia.dataInicio, experiencia.dataFim, experiencia.atual)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/66">{experiencia.descricao}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {conquistas.length > 0 ? (
          <section className="mt-14" data-reveal style={{ ['--reveal-delay' as never]: '130ms' }}>
            <div className="public-divider mb-7">Conquistas</div>
            <div className="grid gap-4 md:grid-cols-3">
              {conquistas.map((conquista, index) => (
                <article
                  key={conquista.id}
                  className="rounded-md border border-amber-300/20 bg-gradient-to-br from-amber-300/[0.12] to-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-amber-300/40 public-interactive"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-4xl font-black leading-none text-amber-200/20">{String(index + 1).padStart(2, '0')}</span>
                    <span className="grid h-10 w-10 place-items-center rounded-md bg-amber-300/12 text-amber-200">
                      <Medal size={19} />
                    </span>
                  </div>
                  <h2 className="mt-5 font-black text-white">{conquista.titulo}</h2>
                  {conquista.data ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-amber-200">{formatarData(conquista.data)}</p> : null}
                  <p className="mt-4 text-sm leading-7 text-white/64">{conquista.descricao}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {certificacoes.length > 0 ? (
          <section className="mt-14" data-reveal style={{ ['--reveal-delay' as never]: '150ms' }}>
            <div className="public-divider mb-7">Certificacoes</div>
            <div className="grid gap-3">
              {certificacoes.map((certificacao) => (
                <article
                  key={certificacao.id}
                  className="grid gap-4 rounded-md border border-white/10 bg-white/[0.045] p-4 transition hover:border-white/20 sm:grid-cols-[auto_1fr_auto] sm:items-center public-interactive"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
                    <Award size={20} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-black text-white">{certificacao.nome}</h2>
                      <span className="inline-flex items-center gap-1 rounded-md bg-cyan-200/10 px-2 py-1 text-[11px] font-bold text-cyan-100">
                        <BadgeCheck size={13} />
                        Credencial
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/58">{certificacao.emissor}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                    {certificacao.dataEmissao ? <span className="text-xs font-semibold text-white/48">{formatarData(certificacao.dataEmissao)}</span> : null}
                    {certificacao.link ? (
                      <a href={certificacao.link} target="_blank" rel="noreferrer" className="text-sm font-bold text-cyan-100 hover:text-white">
                        Ver credencial
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
      </div>

      {mostrarIndicadorScroll ? (
        <button
          type="button"
          onClick={() => window.scrollBy({ top: Math.max(window.innerHeight * 0.72, 320), behavior: 'smooth' })}
          className="public-scroll-indicador"
          aria-label="Rolar para baixo"
        >
          <ChevronDown size={18} className="public-scroll-indicador-icone" />
        </button>
      ) : null}

    </div>
  );
}
