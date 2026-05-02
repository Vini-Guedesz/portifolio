export function Loading({ escuro = false }: { escuro?: boolean }) {
  return (
    <div className={`flex min-h-[220px] items-center justify-center text-sm font-semibold ${escuro ? 'text-white/70' : 'text-tinta/70'}`}>
      Carregando...
    </div>
  );
}
