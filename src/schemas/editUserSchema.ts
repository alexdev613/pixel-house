import { z } from "zod";

export const editUserSchema = z.object({
  id: z.number().int().nonnegative().optional(),

  name: z.string()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(100, "O nome é muito longo."),

  email: z.string()
    .email("Email inválido.")
    .min(5, "O email é obrigatório."),

  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido."),

  birthDate: z.coerce.date()
    .refine(date => !isNaN(date.getTime()), { message: "Data inválida." })
    .refine(date => date <= new Date(), { message: "Data futura inválida." }),

  gender: z.enum(["Masculino", "Feminino", "Outro"], {
    required_error: "Informe o gênero",
  }),

  phone: z.string()
    .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, "Telefone inválido."),
});
