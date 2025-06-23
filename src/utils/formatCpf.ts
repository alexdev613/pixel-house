export function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, ''); // remove tudo que não for número

  return cleaned
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{0,2})$/, '$1.$2.$3-$4');
}