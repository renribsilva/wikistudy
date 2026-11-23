import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/app/lib/database/db";
import { users } from "@/app/lib/database/schema";
import { decrypt } from "@/app/lib/session/session-cryto";
import { decryptEmail } from "@/app/lib/auth/email-crypto";

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
    redirect("/");
  }

  return { isAuth: true, userId: String(session.userId) };
});

/**
 * Busca o usuário autenticado se houver sessão válida, sem redirecionar quando anônimo.
 *
 * Ideal para páginas híbridas (como `/dashboard` como home) que exibem conteúdo padrão
 * para visitantes e personalizam quando há usuário logado.
 *
 * @returns Dados do usuário autenticado ou `null` quando não há sessão ou não é encontrado.
 */
export const getOptionalUser = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

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
  } catch {
    console.error("Failed to fetch user");
    return null;
  }
});

/**
 * Busca os dados do usuário autenticado exigindo sessão válida (`verifySession`).
 *
 * @returns Dados do usuário autenticado ou `null` caso não seja encontrado ou ocorra falha.
 */
export const getUser = cache(async () => {
  const session = await verifySession();

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
  } catch {
    console.error("Failed to fetch user");
    return null;
  }
});
