import "server-only";

import { decryptMwPassword } from "@/app/lib/mediawiki/pw-crypto";
import { verifyMediaWikiCredentials } from "@/app/lib/mediawiki/mw-auth";

export type VerifyAccountResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function verifyExistingMediaWikiAccount(
  mwUsername: string,
  mwPasswordEncrypted: string,
): Promise<VerifyAccountResult> {
  let decryptedPassword: string;

  try {
    decryptedPassword = decryptMwPassword(mwPasswordEncrypted);
  } catch (err) {
    console.error("[MediaWiki] Falha ao descriptografar senha:", err);

    return {
      ok: false,
      status: 500,
      error:
        "Não foi possível recuperar a credencial da conta MediaWiki. Verifique a chave de criptografia.",
    };
  }

  const authentication = await verifyMediaWikiCredentials(
    mwUsername,
    decryptedPassword,
  );

  decryptedPassword = "";

  if (authentication.ok === false) {
    return {
      ok: false,
      status: authentication.status,
      error: authentication.error,
    };
  }

  return { ok: true };
}

export async function verifyNewlyCreatedMediaWikiAccount(
  mwUsername: string,
  password: string,
): Promise<VerifyAccountResult> {
  console.info("[MediaWiki] Verificando login da conta recém-criada.");

  const authentication = await verifyMediaWikiCredentials(mwUsername, password);

  if (authentication.ok === false) {
    console.error("[MediaWiki] Login da conta recém-criada falhou:", {
      username: mwUsername,
      error: authentication.error,
    });

    return {
      ok: false,
      status: authentication.status,
      error: "A conta foi criada, mas a autenticação no MediaWiki falhou.",
    };
  }

  console.info("[MediaWiki] Login da conta recém-criada confirmado.");

  return { ok: true };
}
