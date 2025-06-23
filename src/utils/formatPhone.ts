export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, ''); // Remove tudo que não for número

  if (cleaned.length <= 10) {
    // telefone fixo: (11) 2345-6789
    return cleaned.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
  }

  // celular: (11) 91234-5678
  return cleaned.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
}
