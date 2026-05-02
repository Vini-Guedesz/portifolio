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
import type { Conquista } from '../../types/api';
import { aplicarErrosCampo, obterMensagemErro } from '../../utils/apiError';
import { formatarData } from '../../utils/formatters';

const schema = z.object({
  titulo: z.string().min(1, 'Titulo e obrigatorio').max(160),
  descricao: z.string().min(1, 'Descricao e obrigatoria').max(2000),
  data: z.string(),
});

type ConquistaForm = z.infer<typeof schema>;

const valoresIniciais: ConquistaForm = {
  titulo: '',
  descricao: '',
  data: '',
};

export function AdminConquistas() {
  const hoje = new Date().toISOString().split('T')[0];
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
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
  } = useForm<ConquistaForm>({
    resolver: zodResolver(schema),
    defaultValues: valoresIniciais,
  });

  async function carregar() {
    const data = await portfolioApi.listarConquistas();
    setConquistas(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregar();
  }, []);

  function editar(conquista: Conquista) {
    setFormAberto(true);
    setEditandoId(conquista.id);
    reset({
      titulo: conquista.titulo,
      descricao: conquista.descricao,
      data: conquista.data ?? '',
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
    await portfolioApi.removerConquista(id);
    await carregar();
    if (editandoId === id) {
      novo();
    }
  }

  async function onSubmit(values: ConquistaForm) {
    setErro('');
    try {
      await portfolioApi.salvarConquista(
        {
          ...values,
          data: values.data || null,
        },
        editandoId,
      );
      await carregar();
      setFormAberto(false);
      setEditandoId(undefined);
      reset(valoresIniciais);
      setMensagem('Conquista salva com sucesso.');
    } catch (erroApi) {
      setMensagem('');
      aplicarErrosCampo(erroApi, setError);
      setErro(obterMensagemErro(erroApi, 'Nao foi possivel salvar a conquista.'));
    }
  }

  if (carregando) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader titulo="Conquistas" texto="Registre resultados relevantes da sua trajetoria." />
      {mensagem ? <div className="mb-4 rounded-md bg-musgo/10 p-3 text-sm font-semibold text-musgo">{mensagem}</div> : null}

      <div className="mb-4 flex flex-wrap gap-2">
        {!formAberto ? (
          <button type="button" className="botao-primario" onClick={novo}>
            <Plus size={16} />
            Nova conquista
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
            <h2 className="text-lg font-bold text-tinta">{editandoId ? 'Editar conquista' : 'Nova conquista'}</h2>
          </div>

          {erro ? <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erro}</div> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="label">Titulo</span>
              <input className="campo mt-1" placeholder="Ex.: Promocao para Senior" {...register('titulo')} />
              <FormError mensagem={errors.titulo?.message} />
            </label>
            <label className="block">
              <span className="label">Data</span>
              <input className="campo mt-1" type="date" max={hoje} {...register('data')} />
              <p className="mt-1 text-xs text-tinta/55">Opcional. Nao pode ser uma data futura.</p>
              <FormError mensagem={errors.data?.message} />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="label">Descricao</span>
            <textarea className="campo mt-1 min-h-32" placeholder="Contexto da conquista e impacto gerado." {...register('descricao')} />
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
          {conquistas.length === 0 ? (
            <EmptyState texto="Nenhuma conquista cadastrada." escuro acaoTexto="Nova conquista" onAcao={novo} />
          ) : (
            conquistas.map((conquista) => (
              <article key={conquista.id} className="card p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-bold text-tinta">{conquista.titulo}</h3>
                    {conquista.data ? <p className="mt-1 text-xs font-semibold text-cobre">{formatarData(conquista.data)}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="botao-secundario px-3" onClick={() => editar(conquista)} title="Editar">
                      <Edit3 size={16} />
                      <span className="sr-only">Editar</span>
                    </button>
                    <ConfirmButton onConfirm={() => remover(conquista.id)} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-tinta/70">{conquista.descricao}</p>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
