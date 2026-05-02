import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Plus, Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { portfolioApi } from '../../api/portfolioApi';
import { ConfirmButton } from '../../components/ConfirmButton';
import { EmptyState } from '../../components/EmptyState';
import { FormError } from '../../components/FormError';
import { Loading } from '../../components/Loading';
import { SectionHeader } from '../../components/SectionHeader';
import type { Experiencia } from '../../types/api';
import { aplicarErrosCampo, obterMensagemErro } from '../../utils/apiError';
import { periodo } from '../../utils/formatters';

const schema = z
  .object({
    empresa: z.string().min(1, 'Empresa e obrigatoria').max(160),
    cargo: z.string().min(1, 'Cargo e obrigatorio').max(160),
    descricao: z.string().min(1, 'Descricao e obrigatoria').max(2000),
    dataInicio: z.string().min(1, 'Data inicio e obrigatoria'),
    dataFim: z.string(),
    atual: z.boolean(),
  })
  .refine((values) => values.atual || values.dataFim.length > 0, {
    path: ['dataFim'],
    message: 'Informe a data fim para experiencia encerrada',
  });

type ExperienciaForm = z.infer<typeof schema>;

const valoresIniciais: ExperienciaForm = {
  empresa: '',
  cargo: '',
  descricao: '',
  dataInicio: '',
  dataFim: '',
  atual: true,
};

export function AdminExperiencias() {
  const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
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
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ExperienciaForm>({
    resolver: zodResolver(schema),
    defaultValues: valoresIniciais,
  });
  const experienciaAtual = watch('atual');
  const dataInicio = watch('dataInicio');

  useEffect(() => {
    if (experienciaAtual) {
      setValue('dataFim', '');
    }
  }, [experienciaAtual, setValue]);

  async function carregar() {
    const data = await portfolioApi.listarExperiencias();
    setExperiencias(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  function editar(experiencia: Experiencia) {
    setFormAberto(true);
    setEditandoId(experiencia.id);
    reset({
      empresa: experiencia.empresa,
      cargo: experiencia.cargo,
      descricao: experiencia.descricao,
      dataInicio: experiencia.dataInicio,
      dataFim: experiencia.dataFim ?? '',
      atual: experiencia.atual,
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
    await portfolioApi.removerExperiencia(id);
    await carregar();
    if (editandoId === id) {
      novo();
    }
  }

  async function onSubmit(values: ExperienciaForm) {
    setErro('');
    try {
      await portfolioApi.salvarExperiencia(
        {
          ...values,
          dataFim: values.dataFim || null,
        },
        editandoId,
      );
      await carregar();
      setFormAberto(false);
      setEditandoId(undefined);
      reset(valoresIniciais);
      setMensagem('Experiencia salva com sucesso.');
    } catch (erro) {
      setMensagem('');
      aplicarErrosCampo(erro, setError);
      setErro(obterMensagemErro(erro, 'Nao foi possivel salvar a experiencia.'));
    }
  }

  if (carregando) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader titulo="Experiencias" texto="Gerencie sua trajetoria profissional." />
      {mensagem ? <div className="mb-4 rounded-md bg-musgo/10 p-3 text-sm font-semibold text-musgo">{mensagem}</div> : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {!formAberto ? (
          <button type="button" className="botao-primario" onClick={novo}>
            <Plus size={16} />
            Nova experiencia
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
            <h2 className="text-lg font-bold text-tinta">{editandoId ? 'Editar experiencia' : 'Nova experiencia'}</h2>
          </div>

          {erro ? <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erro}</div> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="label">Empresa</span>
              <input className="campo mt-1" placeholder="Ex.: OpenAI" {...register('empresa')} />
              <FormError mensagem={errors.empresa?.message} />
            </label>
            <label className="block">
              <span className="label">Cargo</span>
              <input className="campo mt-1" placeholder="Ex.: Engenheiro de Software" {...register('cargo')} />
              <FormError mensagem={errors.cargo?.message} />
            </label>
            <label className="block">
              <span className="label">Data inicio</span>
              <input className="campo mt-1" type="date" {...register('dataInicio')} />
              <FormError mensagem={errors.dataInicio?.message} />
            </label>
            <label className="flex items-center gap-3 pt-7 text-sm font-semibold text-tinta">
              <input type="checkbox" className="h-4 w-4 accent-cobre" {...register('atual')} />
              Experiencia atual
            </label>

            <div className="sm:col-span-2">
              <div className={`overflow-hidden transition-all duration-300 ${experienciaAtual ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
                {!experienciaAtual ? (
                  <label className="block">
                    <span className="label">Data fim</span>
                    <input className="campo mt-1" type="date" min={dataInicio || undefined} {...register('dataFim')} />
                    <FormError mensagem={errors.dataFim?.message} />
                  </label>
                ) : null}
              </div>
              {experienciaAtual ? (
                <p className="rounded-md border border-dashed border-white/15 bg-white/[0.04] p-2 text-xs font-semibold text-white/65">
                  Experiencia atual marcada. O campo de data fim fica oculto.
                </p>
              ) : null}
            </div>
          </div>

          <label className="mt-4 block">
            <span className="label">Descricao</span>
            <textarea className="campo mt-1 min-h-32" placeholder="Resumo das responsabilidades e resultados." {...register('descricao')} />
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
          {experiencias.length === 0 ? (
            <EmptyState texto="Nenhuma experiencia cadastrada." escuro acaoTexto="Nova experiencia" onAcao={novo} />
          ) : (
            experiencias.map((experiencia) => (
              <article key={experiencia.id} className="card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-tinta">{experiencia.cargo}</h3>
                    <p className="text-sm font-semibold text-cobre">{experiencia.empresa}</p>
                    <p className="mt-1 text-xs font-semibold text-tinta/55">
                      {periodo(experiencia.dataInicio, experiencia.dataFim, experiencia.atual)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="botao-secundario px-3" onClick={() => editar(experiencia)} title="Editar">
                      <Edit3 size={16} />
                      <span className="sr-only">Editar</span>
                    </button>
                    <ConfirmButton onConfirm={() => remover(experiencia.id)} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-tinta/70">{experiencia.descricao}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
