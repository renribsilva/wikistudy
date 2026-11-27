import "server-only";

import { and, eq, ne } from "drizzle-orm";
import { db } from "@/app/lib/database/db";
import {
  mediawikiAccountPending,
  mediawikiAccounts,
  type UserRole,
  users,
} from "@/app/lib/database/schema";
import { encryptMwPassword } from "@/app/lib/mediawiki/pw-crypto";
import { updateSession } from "@/app/lib/session/session-cryto";

export type PersistAccountResult =
  | { ok: true; role: UserRole }
  | { ok: false; status: number; error: string };

export async function persistAccountAndSyncRole(params: {
  userId: string;
  mwUsername: string;
  plainPassword?: string;
}): Promise<PersistAccountResult> {
  const { userId, mwUsername, plainPassword } = params;

  if (typeof plainPassword === "string") {
    console.info("[MediaWiki] Conta criada. Iniciando criptografia.");

    const mwPasswordEncrypted = encryptMwPassword(plainPassword);

    console.info("[MediaWiki] Senha criptografada com sucesso.", {
      encryptedLength: mwPasswordEncrypted.length,
    });

    console.info("[MediaWiki] Persistindo conta no PostgreSQL.", {
      userId,
      mwUsername,
    });

    await db
      .insert(mediawikiAccounts)
      .values({
        userId,
        mwUsername,
        mwPasswordEncrypted,
      })
      .onConflictDoUpdate({
        target: mediawikiAccounts.userId,
        set: {
          mwUsername,
          mwPasswordEncrypted,
        },
      });

    console.info("[MediaWiki] Conta persistida com sucesso.");
  }

  console.info("[MediaWiki] Atualizando role do usuário.");

  const [updatedUser] = await db
    .update(users)
    .set({ role: "colab" })
    .where(and(eq(users.id, userId), ne(users.role, "admin")))
    .returning({ role: users.role });

  let effectiveRole: UserRole;

  if (updatedUser) {
    effectiveRole = updatedUser.role;
  } else {
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { role: true },
    });

    if (!currentUser) {
      throw new Error(
        "Usuário não encontrado após criação da conta MediaWiki.",
      );
    }

    effectiveRole = currentUser.role;
  }

  console.info("[MediaWiki] Atualizando sessão:", effectiveRole);

  await updateSession(effectiveRole);

  if (typeof plainPassword === "string") {
    await clearPendingMediaWikiAccount(userId);
    console.info("[MediaWiki] Registro pendente removido após vinculação.");
  }

  return { ok: true, role: effectiveRole };
}

export async function clearPendingMediaWikiAccount(
  userId: string,
): Promise<void> {
  await db
    .delete(mediawikiAccountPending)
    .where(eq(mediawikiAccountPending.userId, userId));
}
