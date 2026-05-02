export function formatarData(data?: string | null) {
  if (!data) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${data}T00:00:00`));
}

export function periodo(inicio: string, fim: string | null, atual: boolean) {
  const fimFormatado = atual ? 'Atual' : formatarData(fim);
  return `${formatarData(inicio)} - ${fimFormatado}`;
}
