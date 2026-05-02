import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { FormError } from '../../components/FormError';
import { useAuth } from '../../contexts/AuthContext';
import { obterMensagemErro } from '../../utils/apiError';

const schema = z.object({
  email: z.string().email('Informe um email valido'),
  senha: z.string().min(1, 'Informe a senha'),
});

type LoginForm = z.infer<typeof schema>;

export function AdminLogin() {
  const { autenticado, precisaAlterarCredenciais, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [erro, setErro] = useState('');
  const from = (location.state as { from?: string } | null)?.from ?? '/admin/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@portfolio.com',
      senha: 'admin123',
    },
  });

  if (autenticado) {
    return <Navigate to={precisaAlterarCredenciais ? '/admin/primeiro-acesso' : '/admin/dashboard'} replace />;
  }

  async function onSubmit(values: LoginForm) {
    setErro('');
    try {
      await login(values.email, values.senha);
      navigate(from, { replace: true });
    } catch (erroApi) {
      setErro(obterMensagemErro(erroApi, 'Email ou senha invalidos.'));
    }
  }

  return (
    <div className="admin-shell public-shell grid min-h-screen text-white lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hidden border-r border-white/10 bg-[#0b1412]/80 p-10 text-white backdrop-blur lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="grid h-12 w-12 place-items-center rounded-md border border-amber-300/30 bg-amber-300/12 text-amber-200">
            <LockKeyhole size={22} />
          </div>
          <p className="mt-10 text-xs font-black uppercase tracking-[0.2em] text-amber-300">Admin</p>
          <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight">Painel para gerenciar conteudo do portfolio</h1>
        </div>
        <p className="max-w-lg text-sm leading-6 text-white/70">
          Atualize perfil, experiencias, conquistas, certificacoes e projetos sem alterar codigo.
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="public-card w-full max-w-md p-6">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-amber-300">Admin</p>
            <h2 className="mt-2 text-2xl font-black text-white">Entrar</h2>
          </div>

          {erro ? <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erro}</div> : null}

          <div className="space-y-4">
            <label className="block">
              <span className="label">Email</span>
              <input className="campo mt-1" type="email" {...register('email')} />
              <FormError mensagem={errors.email?.message} />
            </label>

            <label className="block">
              <span className="label">Senha</span>
              <input className="campo mt-1" type="password" {...register('senha')} />
              <FormError mensagem={errors.senha?.message} />
            </label>
          </div>

          <button type="submit" className="botao-primario mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </div>
  );
}
