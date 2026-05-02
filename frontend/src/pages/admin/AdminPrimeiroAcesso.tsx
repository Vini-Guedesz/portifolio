import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { FormError } from '../../components/FormError';
import { useAuth } from '../../contexts/AuthContext';
import { obterMensagemErro } from '../../utils/apiError';

const schema = z
  .object({
    novoEmail: z.string().email('Informe um email valido').max(160),
    senhaAtual: z.string().min(1, 'Informe a senha atual').max(120),
    novaSenha: z.string().min(8, 'Nova senha deve ter no minimo 8 caracteres').max(120),
    confirmarNovaSenha: z.string().min(8, 'Confirme a nova senha').max(120),
  })
  .refine((values) => values.novaSenha === values.confirmarNovaSenha, {
    path: ['confirmarNovaSenha'],
    message: 'A confirmacao da senha nao confere',
  })
  .refine((values) => values.senhaAtual !== values.novaSenha, {
    path: ['novaSenha'],
    message: 'A nova senha deve ser diferente da senha atual',
  });

type PrimeiroAcessoForm = z.infer<typeof schema>;

export function AdminPrimeiroAcesso() {
  const { atualizarPrimeiroAcesso } = useAuth();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrimeiroAcessoForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      novoEmail: '',
      senhaAtual: '',
      novaSenha: '',
      confirmarNovaSenha: '',
    },
  });

  async function onSubmit(values: PrimeiroAcessoForm) {
    setErro('');
    try {
      await atualizarPrimeiroAcesso({
        novoEmail: values.novoEmail,
        senhaAtual: values.senhaAtual,
        novaSenha: values.novaSenha,
      });
      navigate('/admin/dashboard', { replace: true });
    } catch (erroApi) {
      setErro(obterMensagemErro(erroApi, 'Nao foi possivel atualizar as credenciais.'));
    }
  }

  return (
    <div className="admin-shell public-shell grid min-h-screen place-items-center px-4 py-8 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="public-card w-full max-w-lg p-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Primeiro acesso</p>
        <h1 className="mt-3 text-2xl font-black text-white">Atualize email e senha</h1>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Por seguranca, altere as credenciais padrao antes de acessar o painel administrativo.
        </p>

        {erro ? <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{erro}</div> : null}

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="label">Novo email</span>
            <div className="relative mt-1">
              <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input className="campo pl-9" type="email" placeholder="novo-email@dominio.com" {...register('novoEmail')} />
            </div>
            <FormError mensagem={errors.novoEmail?.message} />
          </label>

          <label className="block">
            <span className="label">Senha atual</span>
            <div className="relative mt-1">
              <KeyRound size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input className="campo pl-9" type="password" placeholder="Informe a senha atual" {...register('senhaAtual')} />
            </div>
            <FormError mensagem={errors.senhaAtual?.message} />
          </label>

          <label className="block">
            <span className="label">Nova senha</span>
            <input className="campo mt-1" type="password" placeholder="Minimo de 8 caracteres" {...register('novaSenha')} />
            <FormError mensagem={errors.novaSenha?.message} />
          </label>

          <label className="block">
            <span className="label">Confirmar nova senha</span>
            <input className="campo mt-1" type="password" placeholder="Repita a nova senha" {...register('confirmarNovaSenha')} />
            <FormError mensagem={errors.confirmarNovaSenha?.message} />
          </label>
        </div>

        <button type="submit" className="botao-primario mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar e continuar'}
        </button>
      </form>
    </div>
  );
}
