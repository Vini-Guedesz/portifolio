import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Edit3, Github, Plus, RefreshCcw, Rocket, Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { portfolioApi } from '../../api/portfolioApi';
import { ConfirmButton } from '../../components/ConfirmButton';
import { EmptyState } from '../../components/EmptyState';
import { FormError } from '../../components/FormError';
import { Loading } from '../../components/Loading';
import { SectionHeader } from '../../components/SectionHeader';
import { Tecnologias } from '../../components/Tecnologias';
import type { Projeto } from '../../types/api';
import { aplicarErrosCampo, obterMensagemErro } from '../../utils/apiError';

const urlObrigatoria = z.string().min(1, 'Link e obrigatorio').url('Informe uma URL valida').max(500);
const urlOpcional = z
  .string()
  .max(500)
  .refine((valor) => !valor || z.string().url().safeParse(valor).success, 'Informe uma URL valida');

const schema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio').max(160),
  descricao: z.string().min(1, 'Descricao e obrigatoria').max(2000),
  tecnologias: z.string().min(1, 'Tecnologias sao obrigatorias').max(500),
  githubUrl: urlObrigatoria,
  deployUrl: urlOpcional,
  destaque: z.boolean(),
});

type ProjetoForm = z.infer<typeof schema>;

const valoresIniciais: ProjetoForm = {
  nome: '',
  descricao: '',
  tecnologias: '',
  githubUrl: '',
  deployUrl: '',
  destaque: false,
};

type RepositorioGithub = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  fork: boolean;
};

function extrairUsuarioGithub(url?: string | null) {
  if (!url) {
    return null;
  }
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('github.com')) {
      return null;
    }
    return parsed.pathname.split('/').filter(Boolean)[0] ?? null;
  } catch {
    return null;
  }
}

async function obterTecnologiasRepositorio(repo: RepositorioGithub) {
  const fallback = repo.language ?? 'GitHub';
  try {
    const response = await fetch(repo.languages_url);
    if (!response.ok) {
      return fallback;
    }
    const linguagens = Object.keys((await response.json()) as Record<string, number>);
    if (linguagens.length === 0) {
      return fallback;
    }
    return linguagens.slice(0, 8).join(', ');
  } catch {
    return fallback;
  }
}

export function AdminProjetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [repositoriosGithub, setRepositoriosGithub] = useState<RepositorioGithub[]>([]);
  const [reposSelecionados, setReposSelecionados] = useState<number[]>([]);
  const [usuarioGithub, setUsuarioGithub] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<number | undefined>();
  const [formAberto, setFormAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [carregandoGithub, setCarregandoGithub] = useState(false);
  const [importandoGithub, setImportandoGithub] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [erroGithub, setErroGithub] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjetoForm>({
    resolver: zodResolver(schema),
    defaultValues: valoresIniciais,
  });

  async function carregar() {
    const data = await portfolioApi.listarProjetos();
    setProjetos(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    async function carregarGithub() {
      try {
        const perfil = await portfolioApi.buscarPerfil();
        const usuario = extrairUsuarioGithub(perfil.githubUrl);
        setUsuarioGithub(usuario);
      } catch {
        setUsuarioGithub(null);
      }
    }
    carregarGithub();
  }, []);

  async function buscarRepositoriosGithub() {
    if (!usuarioGithub) {
      setRepositoriosGithub([]);
      setErroGithub('Informe o GitHub no perfil para habilitar a selecao de repositorios.');
      return;
    }
    setErroGithub('');
    setCarregandoGithub(true);
    try {
      const response = await fetch(`https://api.github.com/users/${usuarioGithub}/repos?sort=updated&per_page=100`);
      if (!response.ok) {
        throw new Error();
      }
      const repositorios = ((await response.json()) as RepositorioGithub[])
        .filter((repo) => !repo.fork)
        .sort((a, b) => a.name.localeCompare(b.name));
      setRepositoriosGithub(repositorios);
    } catch {
      setRepositoriosGithub([]);
      setErroGithub('Nao foi possivel carregar repositorios do GitHub agora.');
    } finally {
      setCarregandoGithub(false);
    }
  }

  useEffect(() => {
    if (usuarioGithub) {
      buscarRepositoriosGithub();
    }
  }, [usuarioGithub]);

  function alternarSelecaoRepo(repoId: number) {
    setReposSelecionados((atual) => (atual.includes(repoId) ? atual.filter((id) => id !== repoId) : [...atual, repoId]));
  }

  async function importarRepositoriosSelecionados() {
    const reposParaImportar = repositoriosGithub.filter((repo) => reposSelecionados.includes(repo.id));
    if (reposParaImportar.length === 0) {
      return;
    }

    setImportandoGithub(true);
    setErroGithub('');
    try {
      const githubJaCadastrados = new Set(projetos.map((projeto) => projeto.githubUrl.toLowerCase()));
      let adicionados = 0;

      for (const repo of reposParaImportar) {
        if (githubJaCadastrados.has(repo.html_url.toLowerCase())) {
          continue;
        }
        const tecnologias = await obterTecnologiasRepositorio(repo);
        await portfolioApi.salvarProjeto({
          nome: repo.name,
          descricao: repo.description ?? 'Repositorio importado do GitHub.',
          tecnologias,
          githubUrl: repo.html_url,
          deployUrl: repo.homepage || null,
          destaque: false,
        });
        adicionados++;
      }

      await carregar();
      setReposSelecionados([]);
      setMensagem(
        adicionados > 0
          ? `${adicionados} projeto(s) importado(s) do GitHub com sucesso.`
          : 'Nenhum novo projeto para importar. Os selecionados ja estavam cadastrados.',
      );
    } catch {
      setErroGithub('Falha ao importar repositorios selecionados.');
    } finally {
      setImportandoGithub(false);
    }
  }

  function editar(projeto: Projeto) {
    setFormAberto(true);
    setEditandoId(projeto.id);
    reset({
      nome: projeto.nome,
      descricao: projeto.descricao,
      tecnologias: projeto.tecnologias,
      githubUrl: projeto.githubUrl,
      deployUrl: projeto.deployUrl ?? '',
      destaque: projeto.destaque,
    });
    setMensagem('');
    setErro('');
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function novo() {
    setFormAberto(true);
    setEditandoId(undefined);
    reset(valoresIniciais);
    setMensagem('');
    setErro('');
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }

  function fecharFormulario() {
    setFormAberto(false);
    setEditandoId(undefined);
    setMensagem('');
    setErro('');
    reset(valoresIniciais);
  }

  async function remover(id: number) {
    await portfolioApi.removerProjeto(id);
    await carregar();
    if (editandoId === id) {
      novo();
    }
  }

  async function onSubmit(values: ProjetoForm) {
    setErro('');
    try {
      await portfolioApi.salvarProjeto(
        {
          ...values,
          deployUrl: values.deployUrl || null,
        },
        editandoId,
      );
      await carregar();
      setFormAberto(false);
      setEditandoId(undefined);
      reset(valoresIniciais);
      setMensagem('Projeto salvo com sucesso.');
    } catch (erroApi) {
      setMensagem('');
      aplicarErrosCampo(erroApi, setError);
      setErro(obterMensagemErro(erroApi, 'Nao foi possivel salvar o projeto.'));
    }
  }

  if (carregando) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader titulo="Projetos" texto="Cadastre projetos com tecnologias, GitHub e deploy opcional." />
      {mensagem ? <div className="mb-4 rounded-md bg-musgo/10 p-3 text-sm font-semibold text-musgo">{mensagem}</div> : null}
      <section className="card mb-6 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-tinta">Importar do GitHub</h2>
            <p className="mt-1 text-sm text-tinta/65">
              Selecione repositorios para adicionar ao portfolio publico. Apenas os importados aparecem no viewer.
            </p>
            {usuarioGithub ? (
              <p className="mt-2 text-xs font-semibold text-emerald-200">Usuario detectado: {usuarioGithub}</p>
            ) : (
              <p className="mt-2 text-xs font-semibold text-amber-200">Defina seu link do GitHub no perfil para habilitar.</p>
            )}
          </div>
          <button type="button" className="botao-secundario" onClick={buscarRepositoriosGithub} disabled={!usuarioGithub || carregandoGithub}>
            <RefreshCcw size={16} />
            {carregandoGithub ? 'Atualizando...' : 'Atualizar lista'}
          </button>
        </div>

        {erroGithub ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erroGithub}</div> : null}

        {repositoriosGithub.length > 0 ? (
          <>
            <div className="mt-4 max-h-60 overflow-auto rounded-md border border-white/10">
              {repositoriosGithub.map((repo) => {
                const jaExiste = projetos.some((projeto) => projeto.githubUrl.toLowerCase() === repo.html_url.toLowerCase());
                return (
                  <label key={repo.id} className="flex cursor-pointer items-start gap-3 border-b border-white/5 p-3 last:border-b-0">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 accent-cobre"
                      checked={reposSelecionados.includes(repo.id)}
                      onChange={() => alternarSelecaoRepo(repo.id)}
                      disabled={jaExiste}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-tinta">{repo.name}</p>
                        {jaExiste ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300/30 bg-emerald-300/12 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                            <Check size={12} />
                            Ja cadastrado
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-tinta/60">{repo.description ?? 'Sem descricao no repositorio.'}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" className="botao-primario" onClick={importarRepositoriosSelecionados} disabled={importandoGithub || reposSelecionados.length === 0}>
                <Plus size={16} />
                {importandoGithub ? 'Importando...' : `Importar selecionados (${reposSelecionados.length})`}
              </button>
              <button type="button" className="botao-secundario" onClick={() => setReposSelecionados([])} disabled={reposSelecionados.length === 0}>
                <X size={16} />
                Limpar selecao
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-md border border-dashed border-white/15 bg-white/[0.04] p-3 text-sm text-white/65">
            {carregandoGithub ? 'Carregando repositorios...' : 'Nenhum repositorio carregado.'}
          </div>
        )}
      </section>

      <div className="mb-4 flex flex-wrap gap-2">
        {!formAberto ? (
          <button type="button" className="botao-primario" onClick={novo}>
            <Plus size={16} />
            Novo projeto
          </button>
        ) : null}
      </div>

      <div className={`grid gap-6 ${formAberto ? 'xl:grid-cols-[0.95fr_1.05fr]' : ''}`}>
        {formAberto ? (
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className={`card p-5 transition-all duration-300 ${editandoId ? 'ring-1 ring-amber-300/45 shadow-[0_0_0_1px_rgba(252,211,77,0.12)]' : ''}`}
          >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-tinta">{editandoId ? 'Editar projeto' : 'Novo projeto'}</h2>
          </div>

          {erro ? <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erro}</div> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="label">Nome</span>
              <input className="campo mt-1" placeholder="Ex.: Plataforma de Portfolio" {...register('nome')} />
              <FormError mensagem={errors.nome?.message} />
            </label>
            <label className="block sm:col-span-2">
              <span className="label">Tecnologias</span>
              <input className="campo mt-1" placeholder="Java, Spring Boot, React, PostgreSQL" {...register('tecnologias')} />
              <FormError mensagem={errors.tecnologias?.message} />
            </label>
            <label className="block">
              <span className="label">GitHub</span>
              <input className="campo mt-1" placeholder="https://github.com/usuario/repositorio" {...register('githubUrl')} />
              <FormError mensagem={errors.githubUrl?.message} />
            </label>
            <label className="block">
              <span className="label">Deploy</span>
              <input className="campo mt-1" placeholder="https://..." {...register('deployUrl')} />
              <FormError mensagem={errors.deployUrl?.message} />
            </label>
            <label className="flex items-center gap-3 pt-7 text-sm font-semibold text-tinta">
              <input type="checkbox" className="h-4 w-4 accent-cobre" {...register('destaque')} />
              Projeto em destaque
            </label>
          </div>

          <label className="mt-4 block">
            <span className="label">Descricao</span>
            <textarea className="campo mt-1 min-h-32" placeholder="Objetivo do projeto e principais entregas." {...register('descricao')} />
            <FormError mensagem={errors.descricao?.message} />
          </label>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button type="button" className="botao-secundario" onClick={fecharFormulario}>
              <X size={16} />
              Cancelar
            </button>
            <button type="submit" className="botao-primario" disabled={isSubmitting || !isDirty}>
              {editandoId ? <Save size={16} /> : <Plus size={16} />}
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
          {!isDirty ? <p className="mt-2 text-xs font-semibold text-white/55">Altere algum campo para habilitar o salvamento.</p> : null}
          </form>
        ) : null}

        <section className="space-y-3">
          {projetos.length === 0 ? (
            <EmptyState texto="Nenhum projeto cadastrado." escuro acaoTexto="Novo projeto" onAcao={novo} />
          ) : (
            projetos.map((projeto) => (
              <article key={projeto.id} className="card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-tinta">{projeto.nome}</h3>
                      {projeto.destaque ? (
                        <span className="rounded-md bg-cobre/10 px-2 py-0.5 text-xs font-bold text-cobre">Destaque</span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-tinta/70">{projeto.descricao}</p>
                    <div className="mt-3">
                      <Tecnologias valor={projeto.tecnologias} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={projeto.githubUrl} target="_blank" rel="noreferrer" className="botao-secundario px-3" title="Abrir GitHub">
                      <Github size={16} />
                      <span className="sr-only">GitHub</span>
                    </a>
                    {projeto.deployUrl ? (
                      <a href={projeto.deployUrl} target="_blank" rel="noreferrer" className="botao-secundario px-3" title="Abrir deploy">
                        <Rocket size={16} />
                        <span className="sr-only">Deploy</span>
                      </a>
                    ) : null}
                    <button type="button" className="botao-secundario px-3" onClick={() => editar(projeto)} title="Editar">
                      <Edit3 size={16} />
                      <span className="sr-only">Editar</span>
                    </button>
                    <ConfirmButton onConfirm={() => remover(projeto.id)} />
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
