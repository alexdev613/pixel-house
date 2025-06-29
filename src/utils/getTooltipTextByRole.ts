export function getTooltipTextByRole(role?: string): string {
  switch (role) {
    case "root":
      return "Super administrador com acesso irrestrito. Pode editar e excluir qualquer conta, inclusive de outros administradores.";
    case "admin":
      return "Administrador com acesso para editar usuários comuns e a si mesmo. Não pode alterar contas de outros administradores.";
    case "user":
    default:
      return "Usuário comum. Pode visualizar todos os perfis, mas só pode editar seus próprios dados.";
  }
}
