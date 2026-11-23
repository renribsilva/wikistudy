"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";
import { createSession } from "@/app/identity/session/session";
import { redirect } from "next/navigation";
import { createEmailBlindIndex, encryptEmail } from "./email-crypto";
import { FormState, LoginFormSchema, SignupFormSchema } from "./definitions";

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
