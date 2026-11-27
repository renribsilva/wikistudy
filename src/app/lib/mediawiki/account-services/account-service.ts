// Orquestra a criação, recuperação e vinculação da conta WikiStudy e MediaWiki.
import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/app/lib/database/db";
import {
  mediawikiAccountPending,
  mediawikiAccounts,
} from "@/app/lib/database/schema";
import { decryptMwPassword } from "@/app/lib/mediawiki/pw-crypto";
import {
  createMediaWikiAccount,
  preparePendingMediaWikiAccount,
} from "./account-creation";
import {
  verifyExistingMediaWikiAccount,
  verifyNewlyCreatedMediaWikiAccount,
} from "./account-verification";
import {
  clearPendingMediaWikiAccount,
  persistAccountAndSyncRole,
} from "./account-persistence";

export type FlowResult = {
  status: number;
  body: Record<string, unknown>;
};

const inFlightAccountCreations = new Map<string, Promise<FlowResult>>();

async function recoverPendingMediaWikiAccount(
  userId: string,
  pendingAccount: {
    mwUsername: string;
    mwPasswordEncrypted: string;
  },
): Promise<FlowResult> {
  console.info(
    "[MediaWiki] Conta pendente encontrada. Iniciando recuperação:",
    {
      userId,
      mwUsername: pendingAccount.mwUsername,
    },
  );

  let decryptedPassword: string;

  try {
    decryptedPassword = decryptMwPassword(pendingAccount.mwPasswordEncrypted);
  } catch (err) {
    console.error(
      "[MediaWiki] Falha ao descriptografar senha pendente no recovery:",
      err,
    );

    return {
      status: 500,
      body: {
        ok: false,
        error:
          "Não foi possível recuperar a credencial pendente da conta MediaWiki.",
        authenticated: false,
      },
    };
  }

  const verification = await verifyNewlyCreatedMediaWikiAccount(
    pendingAccount.mwUsername,
    decryptedPassword,
  );

  if (verification.ok === false) {
    decryptedPassword = "";
    return {
      status: verification.status,
      body: {
        ok: false,
        error: verification.error,
        authenticated: false,
      },
    };
  }

  const persisted = await persistAccountAndSyncRole({
    userId,
    mwUsername: pendingAccount.mwUsername,
    plainPassword: decryptedPassword,
  });

  decryptedPassword = "";

  if (persisted.ok === false) {
    return {
      status: persisted.status,
      body: {
        ok: false,
        error: persisted.error,
      },
    };
  }

  console.info(
    "[MediaWiki] Conta pendente recuperada e vinculada com sucesso.",
  );

  return {
    status: 201,
    body: {
      ok: true,
      alreadyExists: false,
      recovered: true,
      authenticated: true,
      username: pendingAccount.mwUsername,
      mwUsername: pendingAccount.mwUsername,
      role: persisted.role,
      message: "Conta pendente recuperada e vinculada com sucesso.",
    },
  };
}

export async function executeCreateAccountFlow(
  userId: string,
): Promise<FlowResult> {
  const existingAccount = await db.query.mediawikiAccounts.findFirst({
    where: eq(mediawikiAccounts.userId, userId),
  });

  if (existingAccount) {
    console.info("[MediaWiki] Conta existente encontrada:", {
      userId,
      mwUsername: existingAccount.mwUsername,
    });

    const verification = await verifyExistingMediaWikiAccount(
      existingAccount.mwUsername,
      existingAccount.mwPasswordEncrypted,
    );

    if (verification.ok === false) {
      return {
        status: verification.status,
        body: {
          ok: false,
          error: verification.error,
          authenticated: false,
        },
      };
    }

    const persisted = await persistAccountAndSyncRole({
      userId,
      mwUsername: existingAccount.mwUsername,
    });

    if (persisted.ok === false) {
      return {
        status: persisted.status,
        body: {
          ok: false,
          error: persisted.error,
        },
      };
    }

    // IMPORTANTE:
    // A conta já está persistida e a sessão já foi atualizada neste ponto.
    // Se a exclusão da pendência falhar por indisponibilidade do PostgreSQL,
    // esta operação poderá retornar erro mesmo com a vinculação concluída.
    // Isso não compromete a conta: em uma nova tentativa, o fluxo encontrará
    // mediawikiAccounts e tentará remover a pendência novamente.
    // Não mover esta exclusão para antes da confirmação da conta e da sessão.
    await clearPendingMediaWikiAccount(userId);

    console.info(
      "[MediaWiki] Pendência removida após confirmação de conta existente e sessão.",
      { userId },
    );

    console.info("[MediaWiki] Conta verificada com sucesso:", {
      mwUsername: existingAccount.mwUsername,
      role: persisted.role,
    });

    return {
      status: 200,
      body: {
        ok: true,
        alreadyExists: true,
        authenticated: true,
        username: existingAccount.mwUsername,
        mwUsername: existingAccount.mwUsername,
        role: persisted.role,
        message: "Autenticação no MediaWiki confirmada.",
      },
    };
  }

  const pendingAccount = await db.query.mediawikiAccountPending.findFirst({
    where: eq(mediawikiAccountPending.userId, userId),
  });

  if (pendingAccount) {
    return recoverPendingMediaWikiAccount(userId, pendingAccount);
  }

  const prepared = await preparePendingMediaWikiAccount(userId);
  if (prepared.ok === false) {
    return {
      status: prepared.status,
      body: {
        ok: false,
        error: prepared.error,
      },
    };
  }

  const created = await createMediaWikiAccount(userId, prepared);

  if (created.ok === false) {
    return {
      status: created.status,
      body: {
        ok: false,
        error: created.error,
        ...(created.details !== undefined ? { details: created.details } : {}),
      },
    };
  }

  const { username, password, mwUserId, alreadyVerified } = created.account;

  if (!alreadyVerified) {
    const verification = await verifyNewlyCreatedMediaWikiAccount(
      username,
      password,
    );

    if (verification.ok === false) {
      return {
        status: verification.status,
        body: {
          ok: false,
          error: verification.error,
          authenticated: false,
        },
      };
    }
  }

  const persisted = await persistAccountAndSyncRole({
    userId,
    mwUsername: username,
    plainPassword: password,
  });

  if (persisted.ok === false) {
    return {
      status: persisted.status,
      body: {
        ok: false,
        error: persisted.error,
      },
    };
  }

  console.info("[MediaWiki] Processo concluído com sucesso.");

  return {
    status: 201,
    body: {
      ok: true,
      alreadyExists: false,
      recovered: Boolean(alreadyVerified),
      authenticated: true,
      username,
      mwUsername: username,
      ...(mwUserId !== null ? { userId: mwUserId } : {}),
      role: persisted.role,
      message: "Conta criada, vinculada e autenticada com sucesso.",
    },
  };
}

export async function createMediaWikiAccountForUser(
  userId: string,
): Promise<FlowResult> {
  const activePromise = inFlightAccountCreations.get(userId);
  if (activePromise) {
    return activePromise;
  }

  const promise = executeCreateAccountFlow(userId).finally(() => {
    inFlightAccountCreations.delete(userId);
  });

  inFlightAccountCreations.set(userId, promise);
  return promise;
}
