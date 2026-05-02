import { isAxiosError } from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

type ErroApi = {
  mensagem?: string;
  campos?: Record<string, string>;
};

export function obterMensagemErro(erro: unknown, fallback: string) {
  if (isAxiosError<ErroApi>(erro)) {
    return erro.response?.data?.mensagem ?? fallback;
  }
  return fallback;
}

export function obterErrosCampo(erro: unknown) {
  if (!isAxiosError<ErroApi>(erro)) {
    return {};
  }
  return erro.response?.data?.campos ?? {};
}

export function aplicarErrosCampo<T extends FieldValues>(erro: unknown, setError: UseFormSetError<T>) {
  const erros = obterErrosCampo(erro);
  for (const [campo, mensagem] of Object.entries(erros)) {
    if (!mensagem) {
      continue;
    }
    setError(campo as Path<T>, {
      type: 'server',
      message: mensagem,
    });
  }
}
