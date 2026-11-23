import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { decrypt } from "@/app/lib/session";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";
import { decryptEmail } from "@/app/lib/email-crypto";

/**
 * Valida a sessão atual a partir do cookie `session` e retorna o `userId` autenticado.
 *
 * Envolvida em `cache()` do React para deduplicar a verificação dentro da mesma requisição.
 * Caso a sessão seja ausente ou inválida, redireciona imediatamente para `/login`.
 *
 * @returns Objeto com `{ isAuth: true, userId }` para sessões válidas.
 */
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: String(session.userId) };
});

/**
 * Busca os dados do usuário autenticado (`id`, `name` e `email` descriptografado).
 *
 * Envolvida em `cache()` do React para evitar consultas repetidas na mesma requisição.
 * Seleciona `emailEncrypted` no banco e realiza a descriptografia no servidor via
 * `decryptEmail`, sem expor `password` ou `emailBlindIndex`.
 *
 * @returns Dados do usuário autenticado ou `null` caso não seja encontrado ou ocorra falha.
 */
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      columns: {
        id: true,
        name: true,
        emailEncrypted: true,
      },
    });

    const user = data[0];
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: decryptEmail(user.emailEncrypted),
    };
  } catch (error) {
    console.log("Failed to fetch user", error);
    return null;
  }
});
