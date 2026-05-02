import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, ExternalLink, Plus, Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { portfolioApi } from '../../api/portfolioApi';
import { ConfirmButton } from '../../components/ConfirmButton';
import { EmptyState } from '../../components/EmptyState';
import { FormError } from '../../components/FormError';
import { Loading } from '../../components/Loading';
import { SectionHeader } from '../../components/SectionHeader';
import type { Certificacao } from '../../types/api';
import { aplicarErrosCampo, obterMensagemErro } from '../../utils/apiError';
import { formatarData } from '../../utils/formatters';

const schema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio').max(180),
  emissor: z.string().min(1, 'Emissor e obrigatorio').max(160),
  dataEmissao: z.string(),
  link: z
    .string()
    .max(500)
    .refine((valor) => !valor || z.string().url().safeParse(valor).success, 'Informe uma URL valida'),
});

type CertificacaoForm = z.infer<typeof schema>;

const valoresIniciais: CertificacaoForm = {
  nome: '',
  emissor: '',
  dataEmissao: '',
  link: '',
};

export function AdminCertificacoes() {
  const hoje = new Date().toISOString().split('T')[0];
  const [certificacoes, setCertificacoes] = useState<Certificacao[]>([]);
  const [editandoId, setEditandoId] = useState<number | undefined>();
  const [formAberto, setFormAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CertificacaoForm>({
    resolver: zodResolver(schema),
    defaultValues: valoresIniciais,
  });

  async function carregar() {
    const data = await portfolioApi.listarCertificacoes();
    setCertificacoes(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  function editar(certificacao: Certificacao) {
    setFormAberto(true);
    setEditandoId(certificacao.id);
    reset({
      nome: certificacao.nome,
      emissor: certificacao.emissor,
      dataEmissao: certificacao.dataEmissao ?? '',
      link: certificacao.link ?? '',
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
    await portfolioApi.removerCertificacao(id);
    await carregar();
    if (editandoId === id) {
      novo();
    }
  }

  async function onSubmit(values: CertificacaoForm) {
    setErro('');
    try {
      await portfolioApi.salvarCertificacao(
        {
          ...values,
          dataEmissao: values.dataEmissao || null,
          link: values.link || null,
        },
        editandoId,
      );
      await carregar();
      setFormAberto(false);
      setEditandoId(undefined);
      reset(valoresIniciais);
      setMensagem('Certificacao salva com sucesso.');
    } catch (erroApi) {
      setMensagem('');
      aplicarErrosCampo(erroApi, setError);
      setErro(obterMensagemErro(erroApi, 'Nao foi possivel salvar a certificacao.'));
    }
  }

  if (carregando) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader titulo="Certificacoes" texto="Mantenha suas certificacoes e credenciais atualizadas." />
      {mensagem ? <div className="mb-4 rounded-md bg-musgo/10 p-3 text-sm font-semibold text-musgo">{mensagem}</div> : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {!formAberto ? (
          <button type="button" className="botao-primario" onClick={novo}>
            <Plus size={16} />
            Nova certificacao
          </button>
        ) : null}
      </div>

      <div className={`grid gap-6 ${formAberto ? 'xl:grid-cols-[0.9fr_1.1fr]' : ''}`}>
        {formAberto ? (
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className={`card p-5 transition-all duration-300 ${editandoId ? 'ring-1 ring-amber-300/45 shadow-[0_0_0_1px_rgba(252,211,77,0.12)]' : ''}`}
          >
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-tinta">{editandoId ? 'Editar certificacao' : 'Nova certificacao'}</h2>
          </div>

          {erro ? <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erro}</div> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label">Nome</span>
              <input className="campo mt-1" placeholder="Ex.: AWS Certified Developer" {...register('nome')} />
              <FormError mensagem={errors.nome?.message} />
            </label>
            <label className="block">
              <span className="label">Emissor</span>
              <input className="campo mt-1" placeholder="Ex.: Amazon Web Services" {...register('emissor')} />
              <FormError mensagem={errors.emissor?.message} />
            </label>
            <label className="block">
              <span className="label">Data emissao</span>
              <input className="campo mt-1" type="date" max={hoje} {...register('dataEmissao')} />
              <p className="mt-1 text-xs text-tinta/55">Opcional. Nao pode ser uma data futura.</p>
              <FormError mensagem={errors.dataEmissao?.message} />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="label">Link da credencial</span>
            <input className="campo mt-1" placeholder="https://..." {...register('link')} />
            <FormError mensagem={errors.link?.message} />
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
          {certificacoes.length === 0 ? (
            <EmptyState texto="Nenhuma certificacao cadastrada." escuro acaoTexto="Nova certificacao" onAcao={novo} />
          ) : (
            certificacoes.map((certificacao) => (
              <article key={certificacao.id} className="card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-tinta">{certificacao.nome}</h3>
                    <p className="text-sm text-tinta/70">{certificacao.emissor}</p>
                    {certificacao.dataEmissao ? (
                      <p className="mt-1 text-xs font-semibold text-cobre">{formatarData(certificacao.dataEmissao)}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    {certificacao.link ? (
                      <a href={certificacao.link} target="_blank" rel="noreferrer" className="botao-secundario px-3" title="Abrir credencial">
                        <ExternalLink size={16} />
                        <span className="sr-only">Abrir credencial</span>
                      </a>
                    ) : null}
                    <button type="button" className="botao-secundario px-3" onClick={() => editar(certificacao)} title="Editar">
                      <Edit3 size={16} />
                      <span className="sr-only">Editar</span>
                    </button>
                    <ConfirmButton onConfirm={() => remover(certificacao.id)} />
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
