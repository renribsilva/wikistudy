"use server";

import crypto from "crypto";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { and, eq, gt, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/app/lib/database/db";
import { passwordResetTokens, users } from "@/app/lib/database/schema";
import { createSession } from "@/app/lib/session/session-cryto";
import {
  createEmailBlindIndex,
  decryptEmail,
  encryptEmail,
} from "./email-crypto";
import { FormState, LoginFormSchema, SignupFormSchema } from "./definitions";
import { sendPasswordResetEmail } from "../resend/send-password-to-email";

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Por favor, insira um e-mail válido." })),
});

const ResetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, { error: "Token inválido ou ausente." }),
    password: z
      .string()
      .min(8, { error: "Deve ter pelo menos 8 caracteres." })
      .regex(/[a-zA-Z]/, { error: "Deve conter pelo menos uma letra." })
      .regex(/[0-9]/, { error: "Deve conter pelo menos um número." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Deve conter pelo menos um caractere especial.",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

function hashResetToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Server Action responsável pelo cadastro de novos usuários.
 *
 * Valida os campos do formulário, gera o blind index e a cifra do e-mail,
 * gera o hash da senha, insere o usuário no banco de dados via Drizzle,
 * inicia a sessão e redireciona para `/dashboard`.
 *
 * @param _state - Estado anterior do formulário gerenciado por `useActionState`.
 * @param formData - Dados enviados pelo formulário de cadastro (`name`, `email`, `password`).
 * @returns Objeto `FormState` com erros de campo ou mensagem geral em caso de falha;
 *          em caso de sucesso, encerra o fluxo redirecionando para `/dashboard`.
 */
export async function signup(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Valida os campos recebidos do formulário com o schema do Zod
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  // 2. Normaliza os dados, prepara blind index + cifra do e-mail e gera o hash da senha
  const name = validatedFields.data.name.trim();
  const email = validatedFields.data.email;
  const emailBlindIndex = createEmailBlindIndex(email);
  const emailEncrypted = encryptEmail(email);
  const password = validatedFields.data.password;
  const hashedPassword = await bcrypt.hash(password, 10);

  let user: { id: string } | undefined;

  // 3. Insere o usuário na tabela `users` tratando violação de unicidade (código Postgres 23505)
  try {
    const data = await db
      .insert(users)
      .values({
        name,
        emailBlindIndex,
        emailEncrypted,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    user = data[0];
  } catch (error: unknown) {
    const pgError = error as { code?: string; cause?: { code?: string } };
    const code = pgError.code ?? pgError.cause?.code;

    if (code === "23505") {
      return {
        errors: {
          email: ["Este e-mail já está cadastrado."],
        },
      };
    }

    return {
      message: "Ocorreu um erro ao criar sua conta.",
    };
  }

  if (!user) {
    return {
      message: "Ocorreu um erro ao criar sua conta.",
    };
  }

  // 4. Cria a sessão do usuário recém-cadastrado (ID UUIDv7)
  await createSession(user.id);

  // 5. Redireciona para a área autenticada (chamado fora do try/catch pois lança erro interno do Next.js)
  redirect("/dashboard");
}

/**
 * Server Action responsável pela autenticação (login) de usuários existentes.
 *
 * Valida e-mail e senha, busca o usuário pelo `emailBlindIndex`, compara o hash
 * da senha com `bcryptjs`, cria a sessão e redireciona para `/dashboard`.
 *
 * @param _state - Estado anterior do formulário gerenciado por `useActionState`.
 * @param formData - Dados enviados pelo formulário de login (`email`, `password`).
 * @returns Objeto `FormState` com erros de campo ou mensagem genérica em caso de falha;
 *          em caso de sucesso, encerra o fluxo redirecionando para `/dashboard`.
 */
export async function login(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  // 1. Valida os campos recebidos do formulário com o schema do Zod
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const email = validatedFields.data.email;
  const emailBlindIndex = createEmailBlindIndex(email);
  const password = validatedFields.data.password;

  try {
    // 2. Busca o usuário pelo blind index do e-mail normalizado
    const data = await db.query.users.findMany({
      where: eq(users.emailBlindIndex, emailBlindIndex),
      columns: {
        id: true,
        password: true,
      },
    });

    const user = data[0];
    if (!user) {
      return {
        message: "E-mail ou senha inválidos.",
      };
    }

    if (!user.password) {
      return {
        message: "E-mail ou senha inválidos. Tente continuar com o Google.",
      };
    }

    // 3. Compara a senha informada com o hash armazenado no banco
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        message: "E-mail ou senha inválidos.",
      };
    }

    // 4. Cria a sessão do usuário autenticado (ID UUIDv7)
    await createSession(user.id);
  } catch {
    return {
      message: "Ocorreu um erro ao tentar entrar.",
    };
  }

  // 5. Redireciona para o dashboard após criar a sessão com sucesso
  redirect("/dashboard");
}

/**
 * Server Action responsável por iniciar o fluxo de recuperação de senha.
 *
 * Busca o usuário por `emailBlindIndex`, gera um token aleatório de uso único,
 * persiste o hash SHA-256 em `passwordResetTokens` com validade de 30 minutos
 * e monta o link de redefinição para `/account/reset-password`. Retorna sempre
 * uma resposta neutra para não expor se o e-mail existe na base.
 *
 * @param _state - Estado anterior do formulário gerenciado por `useActionState`.
 * @param formData - Dados enviados pelo formulário (`email`).
 * @returns Objeto `FormState` com erros de campo ou mensagem neutra de confirmação.
 */
export async function requestPasswordReset(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const neutralMessage =
    "Enviamos um e-mail com o link para redefinir a senha.";

  try {
    const emailBlindIndex = createEmailBlindIndex(validatedFields.data.email);
    const data = await db.query.users.findMany({
      where: eq(users.emailBlindIndex, emailBlindIndex),
      columns: {
        id: true,
        emailEncrypted: true,
      },
    });

    const user = data[0];
    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = hashResetToken(rawToken);
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      const existingToken = await db.query.passwordResetTokens.findFirst({
        where: eq(passwordResetTokens.userId, user.id),
        columns: { id: true },
      });

      if (existingToken) {
        await db
          .update(passwordResetTokens)
          .set({
            tokenHash,
            expiresAt,
            usedAt: null,
            createdAt: new Date(),
          })
          .where(eq(passwordResetTokens.userId, user.id));
      } else {
        await db.insert(passwordResetTokens).values({
          userId: user.id,
          tokenHash,
          expiresAt,
        });
      }

      const recipientEmail = decryptEmail(user.emailEncrypted);
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

      await sendPasswordResetEmail({
        to: recipientEmail,
        resetUrl,
      });
    }
    return { message: neutralMessage };
  } catch {
    return {
      message: "Ocorreu um erro ao processar a solicitação.",
    };
  }
}

/**
 * Server Action responsável por concluir a redefinição de senha.
 *
 * Valida o token e a nova senha, verifica se o token não foi usado (`usedAt` nulo)
 * e ainda não expirou (`expiresAt > now`), atualiza o hash `password` em `users`,
 * marca o token como usado e redireciona para `/login`.
 *
 * @param _state - Estado anterior do formulário gerenciado por `useActionState`.
 * @param formData - Dados enviados pelo formulário (`token`, `password`, `confirmPassword`).
 * @returns Objeto `FormState` com erros de campo ou mensagem de erro; redireciona em caso de sucesso.
 */
export async function resetPassword(
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = ResetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const tokenHash = hashResetToken(validatedFields.data.token);
  const now = new Date();

  try {
    const tokens = await db.query.passwordResetTokens.findMany({
      where: and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, now),
      ),
      columns: {
        id: true,
        userId: true,
      },
    });

    const resetToken = tokens[0];
    if (!resetToken) {
      return {
        message: "Link de redefinição inválido ou expirado.",
      };
    }

    const hashedPassword = await bcrypt.hash(validatedFields.data.password, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, resetToken.userId));

    await db
      .update(passwordResetTokens)
      .set({ usedAt: now })
      .where(eq(passwordResetTokens.id, resetToken.id));
  } catch {
    return {
      message: "Não foi possível redefinir a senha.",
    };
  }

  redirect("/login");
}
