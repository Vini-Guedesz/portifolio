export function SectionHeader({ titulo, texto }: { titulo: string; texto?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-tinta sm:text-3xl">{titulo}</h1>
      {texto ? <p className="mt-2 max-w-3xl text-sm leading-6 text-tinta/70">{texto}</p> : null}
    </div>
  );
}
