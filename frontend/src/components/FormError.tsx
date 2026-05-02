export function FormError({ mensagem }: { mensagem?: string }) {
  if (!mensagem) {
    return null;
  }

  return <p className="erro-campo">{mensagem}</p>;
}
