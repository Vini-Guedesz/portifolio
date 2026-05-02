export function Tecnologias({ valor, escuro = false }: { valor: string; escuro?: boolean }) {
  const tecnologias = valor
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {tecnologias.map((tecnologia) => (
        <span
          key={tecnologia}
          className={
            escuro
              ? 'rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-100'
              : 'rounded-md bg-musgo/10 px-2.5 py-1 text-xs font-semibold text-musgo'
          }
        >
          {tecnologia}
        </span>
      ))}
    </div>
  );
}
