import "server-only";

import { and, eq } from "drizzle-orm";
import { db } from "@/app/lib/database/db";
import {
  mediawikiAccountPending,
  mediawikiAccounts,
  type UserRole,
  users,
} from "@/app/lib/database/schema";

export type DisconnectResult =
  | { ok: true; role: UserRole }
  | { ok: false; status: number; error: string };

/**
 * Desativa o acesso de colaborador no WikiStudy mantendo o registro da conta
 * MediaWiki para permitir reativação futura sem criar outro usuário na wiki.
 */
export async function disconnectMediaWikiAccount(
  userId: string,
): Promise<DisconnectResult> {
  const currentUser = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      role: true,
    },
  });

  if (!currentUser) {
    return {
      ok: false,
      status: 404,
      error: "Usuário não encontrado no WikiStudy.",
    };
  }

  const existingAccount = await db.query.mediawikiAccounts.findFirst({
    where: eq(mediawikiAccounts.userId, userId),
    columns: {
      mwUsername: true,
    },
  });

  const mwUsername = existingAccount?.mwUsername?.trim();

  if (!existingAccount || !mwUsername) {
    return {
      ok: false,
      status: 404,
      error: "Nenhuma conta MediaWiki vinculada encontrada.",
    };
  }

  const nextRole: UserRole =
    currentUser.role === "colab" ? "user" : currentUser.role;

  try {
    await db
      .delete(mediawikiAccountPending)
      .where(eq(mediawikiAccountPending.userId, userId));

    if (currentUser.role === "colab") {
      await db
        .update(users)
        .set({
          role: "user",
        })
        .where(and(eq(users.id, userId), eq(users.role, "colab")));
    }
  } catch (dbErr) {
    console.error("[MediaWiki] Falha ao desativar modo colaborador:", {
      userId,
      mwUsername,
      error: dbErr,
    });

    return {
      ok: false,
      status: 500,
      error: "Houve falha ao atualizar os dados locais. Tente novamente.",
    };
  }

  console.info("[MediaWiki] Modo colaborador desativado (vínculo mantido):", {
    userId,
    mwUsername,
    previousRole: currentUser.role,
    nextRole,
  });

  return {
    ok: true,
    role: nextRole,
  };
}
