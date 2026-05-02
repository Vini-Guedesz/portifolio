import { Trash2 } from 'lucide-react';

export function ConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  function confirmar() {
    if (window.confirm('Deseja remover este registro?')) {
      onConfirm();
    }
  }

  return (
    <button type="button" className="botao-secundario px-3" onClick={confirmar} title="Remover">
      <Trash2 size={16} />
      <span className="sr-only">Remover</span>
    </button>
  );
}
