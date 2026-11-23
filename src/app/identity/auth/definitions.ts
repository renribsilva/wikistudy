import * as z from "zod";

/**
 * Schema de validação para o formulário de cadastro (`SignupFormSchema`).
 *
 * Valida nome, e-mail normalizado e senha forte antes do processamento no
 * servidor.
 *
 * @remarks
 * - `email` é aparado (`trim()`) e convertido para minúsculas (`toLowerCase()`).
 * - `password` exige no mínimo 8 caracteres, ao menos uma letra, um número e um
 *   caractere especial.
 */
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "O nome deve ter pelo menos 2 caracteres." })
    .trim(),
  email: z
    .string()
    .trim()
    .toLowerCase()
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
    .pipe(z.email({ error: "Por favor, insira um e-mail válido." })),
  password: z.string().min(1, { error: "A senha é obrigatória." }),
});

/**
 * Estado retornado por Server Actions de formulário de autenticação.
 *
 * Contém erros de validação por campo (`errors`), uma mensagem geral (`message`)
 * ou `undefined` quando ainda não houve submissão/erro.
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

/**
 * Payload embarcado no JWT de sessão da aplicação.
 *
 * Estende `JWTPayload` do `jose` para incluir o identificador do usuário
 * autenticado (`userId`).
 */
