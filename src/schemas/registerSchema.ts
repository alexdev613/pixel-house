import { z } from "zod";

export const createUserSchema = z.object({
  id: z.number().int().nonnegative().optional(),

  name: z.string()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(100, "O nome é muito longo."),

  email: z.string()
    .email("Email inválido.")
    .min(5, "O email é obrigatório."),

  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00"),

  birthDate: z.coerce.date()
    .refine((date) => !isNaN(date.getTime()), { message: "Data de nascimento inválida." })
    .refine((date) => date <= new Date(), { message: "Data de nascimento não pode ser futura." }),

  gender: z.enum(["Masculino", "Feminino", "Outro"], {
    required_error: "Gênero é obrigatório.",
  }),

  phone: z.string()
    .regex(/^\(\d{2}\)\s?\d{4,5}-\d{4}$/, "Telefone inválido. Use o formato (00) 00000-0000"),

  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),

  confirmPassword: z.string().min(6, "A confirmação de senha é obrigatória."),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não coincidem.",
});
