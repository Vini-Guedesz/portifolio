type EmptyStateProps = {
  texto: string;
  escuro?: boolean;
  acaoTexto?: string;
  onAcao?: () => void;
};

export function EmptyState({ texto, escuro = false, acaoTexto, onAcao }: EmptyStateProps) {
  return (
    <div
      className={
        escuro
          ? 'rounded-md border border-dashed border-white/15 bg-white/5 p-6 text-sm text-white/60'
          : 'rounded-md border border-dashed border-tinta/20 bg-white p-6 text-sm text-tinta/70'
      }
    >
      <p>{texto}</p>
      {acaoTexto && onAcao ? (
        <button type="button" className="botao-secundario mt-4" onClick={onAcao}>
          {acaoTexto}
        </button>
      ) : null}
    </div>
  );
}
