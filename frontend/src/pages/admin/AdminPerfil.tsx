import { zodResolver } from '@hookform/resolvers/zod';
import { ImageUp, RotateCcw, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { portfolioApi } from '../../api/portfolioApi';
import { FormError } from '../../components/FormError';
import { Loading } from '../../components/Loading';
import { SectionHeader } from '../../components/SectionHeader';
import { aplicarErrosCampo, obterMensagemErro } from '../../utils/apiError';

const schema = z.object({
  nome: z.string().min(1, 'Nome e obrigatorio').max(120),
  username: z
    .string()
    .min(3, 'Username deve ter no minimo 3 caracteres')
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Username deve conter apenas letras minusculas, numeros e hifen'),
  cargo: z.string().min(1, 'Cargo e obrigatorio').max(120),
  resumo: z.string().min(1, 'Resumo e obrigatorio').max(2000),
  fotoUrl: z
    .string()
    .max(500)
    .refine((valor) => !valor || z.string().url().safeParse(valor).success, 'Informe uma URL valida'),
  disponibilidade: z.string().min(1, 'Disponibilidade e obrigatoria').max(160),
  emailContato: z
    .string()
    .max(160)
    .refine((valor) => !valor || z.string().email().safeParse(valor).success, 'Informe um email valido'),
  linkedinUrl: z
    .string()
    .max(500)
    .refine((valor) => !valor || z.string().url().safeParse(valor).success, 'Informe uma URL valida'),
  githubUrl: z
    .string()
    .max(500)
    .refine((valor) => !valor || z.string().url().safeParse(valor).success, 'Informe uma URL valida'),
  xUrl: z
    .string()
    .max(500)
    .refine((valor) => !valor || z.string().url().safeParse(valor).success, 'Informe uma URL valida'),
  tiktokUrl: z
    .string()
    .max(500)
    .refine((valor) => !valor || z.string().url().safeParse(valor).success, 'Informe uma URL valida'),
  palavrasChave: z.string().max(600),
});

type PerfilForm = z.infer<typeof schema>;

export function AdminPerfil() {
  const [carregando, setCarregando] = useState(true);
  const [perfilCriado, setPerfilCriado] = useState(false);
  const [ultimoPerfilSalvo, setUltimoPerfilSalvo] = useState<PerfilForm | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const seletorArquivoRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    reset,
    setError,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PerfilForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: '',
      username: '',
      cargo: '',
      resumo: '',
      fotoUrl: '',
      disponibilidade: 'Disponivel para oportunidades',
      emailContato: '',
      linkedinUrl: '',
      githubUrl: '',
      xUrl: '',
      tiktokUrl: '',
      palavrasChave: '',
    },
  });

  useEffect(() => {
    portfolioApi
      .buscarPerfil()
      .then((perfil) => {
        setPerfilCriado(true);
        const dados = {
          nome: perfil.nome,
          username: perfil.username,
          cargo: perfil.cargo,
          resumo: perfil.resumo,
          fotoUrl: perfil.fotoUrl ?? '',
          disponibilidade: perfil.disponibilidade,
          emailContato: perfil.emailContato ?? '',
          linkedinUrl: perfil.linkedinUrl ?? '',
          githubUrl: perfil.githubUrl ?? '',
          xUrl: perfil.xUrl ?? '',
          tiktokUrl: perfil.tiktokUrl ?? '',
          palavrasChave: perfil.palavrasChave ?? '',
        };
        reset(dados);
        setUltimoPerfilSalvo(dados);
      })
      .catch(() => {
        setPerfilCriado(false);
        setUltimoPerfilSalvo(null);
      })
      .finally(() => setCarregando(false));
  }, [reset]);

  const usernameAtual = watch('username');
  const urlPublica = usernameAtual ? `${window.location.origin}/${usernameAtual}/sobre` : '';

  function descartarAlteracoes() {
    if (ultimoPerfilSalvo) {
      reset(ultimoPerfilSalvo);
      return;
    }
    reset({
      nome: '',
      username: '',
      cargo: '',
      resumo: '',
      fotoUrl: '',
      disponibilidade: 'Disponivel para oportunidades',
      emailContato: '',
      linkedinUrl: '',
      githubUrl: '',
      xUrl: '',
      tiktokUrl: '',
      palavrasChave: '',
    });
  }

  async function onSubmit(values: PerfilForm) {
    setMensagem('');
    setErro('');
    try {
      await portfolioApi.atualizarPerfil(values);
      setPerfilCriado(true);
      setUltimoPerfilSalvo(values);
      reset(values);
      setMensagem('Perfil atualizado com sucesso.');
    } catch (erroApi) {
      aplicarErrosCampo(erroApi, setError);
      setErro(obterMensagemErro(erroApi, 'Nao foi possivel atualizar o perfil.'));
    }
  }

  async function onUploadFoto() {
    if (!arquivoFoto) {
      setErro('Selecione um arquivo de imagem para enviar.');
      return;
    }
    setErro('');
    setMensagem('');
    setEnviandoFoto(true);
    try {
      const perfilAtualizado = await portfolioApi.uploadFotoPerfil(arquivoFoto);
      setValue('fotoUrl', perfilAtualizado.fotoUrl ?? '', { shouldDirty: true });
      setMensagem('Foto enviada com sucesso. Clique em Salvar para persistir o restante do formulario.');
      setArquivoFoto(null);
      if (seletorArquivoRef.current) {
        seletorArquivoRef.current.value = '';
      }
    } catch (erroApi) {
      setErro(obterMensagemErro(erroApi, 'Nao foi possivel enviar a foto.'));
    } finally {
      setEnviandoFoto(false);
    }
  }

  if (carregando) {
    return <Loading />;
  }

  return (
    <div>
      <SectionHeader titulo="Perfil" texto="Dados exibidos nas paginas publicas." />

      <form onSubmit={handleSubmit(onSubmit)} className="card max-w-3xl p-6">
        {!perfilCriado ? (
          <div className="mb-4 rounded-md bg-amber-300/10 p-3 text-sm font-semibold text-amber-200">Perfil ainda nao criado. Preencha e salve para publicar.</div>
        ) : null}
        {mensagem ? <div className="mb-4 rounded-md bg-musgo/10 p-3 text-sm font-semibold text-musgo">{mensagem}</div> : null}
        {erro ? <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erro}</div> : null}
        {urlPublica ? (
          <div className="mb-4 rounded-md border border-white/15 bg-white/[0.04] p-3">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">URL publica</p>
            <p className="mt-1 text-sm font-semibold text-white/90">{urlPublica}</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Nome</span>
            <input className="campo mt-1" placeholder="Ex.: Maria Silva" {...register('nome')} />
            <FormError mensagem={errors.nome?.message} />
          </label>

          <label className="block">
            <span className="label">Username (URL publica)</span>
            <input className="campo mt-1" placeholder="maria-silva" {...register('username')} />
            <p className="mt-1 text-xs text-tinta/55">Somente minusculas, numeros e hifen.</p>
            <FormError mensagem={errors.username?.message} />
          </label>

          <label className="block">
            <span className="label">Cargo</span>
            <input className="campo mt-1" placeholder="Ex.: Desenvolvedora Full Stack" {...register('cargo')} />
            <FormError mensagem={errors.cargo?.message} />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="label">Resumo</span>
          <textarea className="campo mt-1 min-h-40" placeholder="Resumo profissional objetivo e direto." {...register('resumo')} />
          <FormError mensagem={errors.resumo?.message} />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Foto URL</span>
            <input className="campo mt-1" placeholder="https://..." {...register('fotoUrl')} />
            <FormError mensagem={errors.fotoUrl?.message} />
          </label>

          <div className="block">
            <span className="label">Upload de foto</span>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                ref={seletorArquivoRef}
                className="campo"
                type="file"
                accept="image/*"
                onChange={(evento) => setArquivoFoto(evento.target.files?.[0] ?? null)}
              />
              <button type="button" className="botao-secundario whitespace-nowrap" onClick={onUploadFoto} disabled={enviandoFoto || !arquivoFoto}>
                <ImageUp size={16} />
                {enviandoFoto ? 'Enviando...' : 'Enviar foto'}
              </button>
            </div>
            <p className="mt-1 text-xs text-tinta/55">Aceita imagens ate 2MB.</p>
          </div>

          <label className="block">
            <span className="label">Disponibilidade</span>
            <input className="campo mt-1" {...register('disponibilidade')} />
            <FormError mensagem={errors.disponibilidade?.message} />
          </label>

          <label className="block">
            <span className="label">Email de contato</span>
            <input className="campo mt-1" type="email" placeholder="contato@exemplo.com" {...register('emailContato')} />
            <FormError mensagem={errors.emailContato?.message} />
          </label>

          <label className="block">
            <span className="label">LinkedIn</span>
            <input className="campo mt-1" placeholder="https://linkedin.com/in/..." {...register('linkedinUrl')} />
            <FormError mensagem={errors.linkedinUrl?.message} />
          </label>

          <label className="block">
            <span className="label">GitHub</span>
            <input className="campo mt-1" placeholder="https://github.com/..." {...register('githubUrl')} />
            <FormError mensagem={errors.githubUrl?.message} />
          </label>

          <label className="block">
            <span className="label">X</span>
            <input className="campo mt-1" placeholder="https://x.com/..." {...register('xUrl')} />
            <FormError mensagem={errors.xUrl?.message} />
          </label>

          <label className="block sm:col-span-2">
            <span className="label">TikTok</span>
            <input className="campo mt-1" placeholder="https://tiktok.com/@..." {...register('tiktokUrl')} />
            <FormError mensagem={errors.tiktokUrl?.message} />
          </label>

          <label className="block sm:col-span-2">
            <span className="label">Palavras-chave (chips da pagina Sobre)</span>
            <input className="campo mt-1" placeholder="REST APIs, Banco versionado, Deploy com Docker" {...register('palavrasChave')} />
            <p className="mt-1 text-xs text-tinta/55">Separe por virgula.</p>
            <FormError mensagem={errors.palavrasChave?.message} />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button type="button" className="botao-secundario" onClick={descartarAlteracoes} disabled={!isDirty || isSubmitting}>
            <RotateCcw size={16} />
            Descartar alteracoes
          </button>
          <button type="submit" className="botao-primario" disabled={isSubmitting || !isDirty}>
            <Save size={16} />
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
        {!isDirty ? <p className="mt-2 text-xs font-semibold text-white/55">Altere algum campo para habilitar o salvamento.</p> : null}
      </form>
    </div>
  );
}
