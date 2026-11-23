import * as z from "zod";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;

/**
 * Schema de validação para o formulário de cadastro (`SignupFormSchema`).
 *
 * Valida nome, e-mail normalizado e senha forte antes do processamento no
 * servidor.
 */
export const SignupFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "O nome deve ter pelo menos 2 caracteres." })
    .max(MAX_NAME_LENGTH, {
      error: `O nome deve ter no máximo ${MAX_NAME_LENGTH} caracteres.`,
    }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(MAX_EMAIL_LENGTH, {
      error: `O e-mail deve ter no máximo ${MAX_EMAIL_LENGTH} caracteres.`,
    })
    .pipe(z.email({ error: "Por favor, insira um e-mail válido." })),
  password: z
    .string()
    .min(8, { error: "Deve ter pelo menos 8 caracteres." })
    .regex(/[a-zA-Z]/, { error: "Deve conter pelo menos uma letra." })
    .regex(/[0-9]/, { error: "Deve conter pelo menos um número." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Deve conter pelo menos um caractere especial.",
    })
    .trim(),
});

/**
 * Schema de validação para o formulário de login (`LoginFormSchema`).
 *
 * Valida e normaliza o e-mail e garante que a senha não esteja vazia antes da
 * autenticação.
 */
export const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(MAX_EMAIL_LENGTH, {
      error: `O e-mail deve ter no máximo ${MAX_EMAIL_LENGTH} caracteres.`,
    })
    .pipe(z.email({ error: "Por favor, insira um e-mail válido." })),
  password: z.string().min(1, { error: "A senha é obrigatória." }),
});

/**
 * Estado retornado por Server Actions de formulário de autenticação.
 */
export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;
