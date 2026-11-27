import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/app/lib/database/db";
import { mediawikiAccountPending } from "@/app/lib/database/schema";
import {
  decryptMwPassword,
  encryptMwPassword,
} from "@/app/lib/mediawiki/pw-crypto";
import {
  generateMwPassword,
  toValidMwUsername,
} from "@/app/lib/mediawiki/mw-credentials";
import {
  buildCookieHeader,
  extractCookieHeader,
  isTimeoutOrAbortError,
  MW_API_URL,
  MW_REQUEST_TIMEOUT_MS,
  parseMediaWikiJsonResponse,
  USER_AGENT,
} from "@/app/lib/mediawiki/mw-http";
import { verifyMediaWikiCredentials } from "@/app/lib/mediawiki/mw-auth";

export type CreatedMwAccount = {
  username: string;
  password: string;
  mwUserId: number | null;
  alreadyVerified?: boolean;
};

export type CreateMwAccountResult =
  | { ok: true; account: CreatedMwAccount }
  | { ok: false; status: number; error: string; details?: unknown };

export type PreparedMwAccount =
  | { ok: true; username: string; password: string }
  | { ok: false; status: number; error: string };

function isUsernameAlreadyExistsError(createaccount?: {
  status?: string;
  message?: string;
  messagecode?: string;
  code?: string;
}): boolean {
  const combinedText = [
    createaccount?.status,
    createaccount?.message,
    createaccount?.messagecode,
    createaccount?.code,
  ]
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .join(" ")
    .toLowerCase();

  return (
    combinedText.includes("userexists") ||
    combinedText.includes("username-exists") ||
    combinedText.includes("already exists") ||
    combinedText.includes("already in use") ||
    combinedText.includes("em uso") ||
    combinedText.includes("já existe")
  );
}

function resolveCanonicalUsername(
  apiUsername: string | undefined,
  fallbackUsername: string,
): string {
  return typeof apiUsername === "string" && apiUsername.trim().length > 0
    ? apiUsername.trim()
    : fallbackUsername;
}

/**
 * Gera username e senha (ou reutiliza credencial pendente existente),
 * criptografa a senha e salva temporariamente em `mediawiki_account_pending`
 * antes de chamar `action=createaccount` no MediaWiki.
 */
export async function preparePendingMediaWikiAccount(
  userId: string,
): Promise<PreparedMwAccount> {
  const existingPending = await db.query.mediawikiAccountPending.findFirst({
    where: eq(mediawikiAccountPending.userId, userId),
  });

  if (existingPending) {
    try {
      const password = decryptMwPassword(existingPending.mwPasswordEncrypted);
      return {
        ok: true,
        username: existingPending.mwUsername,
        password,
      };
    } catch (err) {
      console.error(
        "[MediaWiki] Falha ao descriptografar credencial pendente:",
        err,
      );
      return {
        ok: false,
        status: 500,
        error:
          "Não foi possível recuperar a credencial pendente da conta MediaWiki.",
      };
    }
  }

  const username = toValidMwUsername(userId);
  const password = generateMwPassword();
  const mwPasswordEncrypted = encryptMwPassword(password);

  await db
    .insert(mediawikiAccountPending)
    .values({
      userId,
      mwUsername: username,
      mwPasswordEncrypted,
    })
    .onConflictDoUpdate({
      target: mediawikiAccountPending.userId,
      set: {
        mwUsername: username,
        mwPasswordEncrypted,
      },
    });

  return { ok: true, username, password };
}

export async function createMediaWikiAccount(
  userId: string,
  preparedAccount?: PreparedMwAccount,
): Promise<CreateMwAccountResult> {
  const prepared: PreparedMwAccount =
    preparedAccount ?? (await preparePendingMediaWikiAccount(userId));

  if (prepared.ok === false) {
    return {
      ok: false,
      status: prepared.status,
      error: prepared.error,
    };
  }

  const requestedUsername = prepared.username;
  const password = prepared.password;
  const cookieJar = new Map<string, string>();

  const tokenUrl = new URL(MW_API_URL);
  tokenUrl.searchParams.set("action", "query");
  tokenUrl.searchParams.set("meta", "tokens");
  tokenUrl.searchParams.set("type", "createaccount");
  tokenUrl.searchParams.set("format", "json");
  tokenUrl.searchParams.set("formatversion", "2");

  let tokenRes: Response;
  try {
    tokenRes = await fetch(tokenUrl.toString(), {
      method: "GET",
      headers: { "User-Agent": USER_AGENT },
      cache: "no-store",
      signal: AbortSignal.timeout(MW_REQUEST_TIMEOUT_MS),
    });
  } catch (fetchErr) {
    const isTimeout = isTimeoutOrAbortError(fetchErr);
    return {
      ok: false,
      status: isTimeout ? 504 : 502,
      error: isTimeout
        ? "Tempo limite esgotado ao obter token no MediaWiki."
        : "Falha de rede ao comunicar com o MediaWiki para obter token.",
    };
  }

  extractCookieHeader(tokenRes, cookieJar);

  if (!tokenRes.ok) {
    return {
      ok: false,
      status: 502,
      error: `Falha ao obter token no MediaWiki (HTTP ${tokenRes.status}).`,
    };
  }

  const parsedToken = await parseMediaWikiJsonResponse(
    tokenRes,
    "obter token de criação de conta",
  );
  if (!parsedToken.ok) {
    return {
      ok: false,
      status: 502,
      error: parsedToken.error,
    };
  }

  const tokenData = parsedToken.data as {
    query?: { tokens?: { createaccounttoken?: string } };
  };

  const createToken: string | undefined =
    tokenData?.query?.tokens?.createaccounttoken;

  if (!createToken) {
    return {
      ok: false,
      status: 400,
      error: "Não foi possível obter createaccounttoken.",
      details: tokenData,
    };
  }

  const formBody = new URLSearchParams({
    action: "createaccount",
    username: requestedUsername,
    password,
    retype: password,
    createtoken: createToken,
    createreturnurl: "https://mediawikistudy.onrender.com/",
    format: "json",
    formatversion: "2",
  });

  const currentCookieHeader = buildCookieHeader(cookieJar);

  let createRes: Response;
  try {
    createRes = await fetch(MW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
        ...(currentCookieHeader ? { Cookie: currentCookieHeader } : {}),
      },
      body: formBody.toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(MW_REQUEST_TIMEOUT_MS),
    });
  } catch (fetchErr) {
    const isTimeout = isTimeoutOrAbortError(fetchErr);
    return {
      ok: false,
      status: isTimeout ? 504 : 502,
      error: isTimeout
        ? "Tempo limite esgotado ao criar conta no MediaWiki."
        : "Falha de rede ao comunicar com o MediaWiki na criação da conta.",
    };
  }

  extractCookieHeader(createRes, cookieJar);

  if (!createRes.ok) {
    return {
      ok: false,
      status: 502,
      error: `Falha ao criar conta no MediaWiki (HTTP ${createRes.status}).`,
    };
  }

  const parsedCreate = await parseMediaWikiJsonResponse(
    createRes,
    "criar conta na wiki",
  );
  if (!parsedCreate.ok) {
    return {
      ok: false,
      status: 502,
      error: parsedCreate.error,
    };
  }

  const createData = parsedCreate.data as {
    createaccount?: {
      status?: string;
      message?: string;
      messagecode?: string;
      code?: string;
      username?: string;
      userid?: number | null;
    };
  };

  const status = createData?.createaccount?.status;
  const resolvedUsername = resolveCanonicalUsername(
    createData?.createaccount?.username,
    requestedUsername,
  );

  if (status !== "PASS") {
    if (isUsernameAlreadyExistsError(createData?.createaccount)) {
      console.warn(
        "[MediaWiki] Username já existe durante createaccount. Testando autenticação com credencial pendente:",
        { userId, username: resolvedUsername },
      );

      const authCheck = await verifyMediaWikiCredentials(
        resolvedUsername,
        password,
      );

      if (authCheck.ok === false) {
        console.warn(
          "[MediaWiki] Falha ao autenticar username existente com credencial pendente; mantendo registro pendente:",
          {
            userId,
            username: resolvedUsername,
            error: authCheck.error,
          },
        );

        return {
          ok: false,
          status: authCheck.status,
          error:
            createData?.createaccount?.message ??
            "O nome de usuário já existe no MediaWiki e não foi possível autenticar com a credencial pendente.",
          details: createData,
        };
      }

      console.info(
        "[MediaWiki] Conta já existente autenticada com credencial pendente. Recuperando:",
        { userId, username: resolvedUsername },
      );

      return {
        ok: true,
        account: {
          username: resolvedUsername,
          password,
          mwUserId: createData.createaccount?.userid ?? null,
          alreadyVerified: true,
        },
      };
    }

    return {
      ok: false,
      status: 400,
      error:
        createData?.createaccount?.message ?? "Criação de conta não concluída.",
      details: createData,
    };
  }

  const mwPasswordEncrypted = encryptMwPassword(password);

  await db
    .insert(mediawikiAccountPending)
    .values({
      userId,
      mwUsername: resolvedUsername,
      mwPasswordEncrypted,
    })
    .onConflictDoUpdate({
      target: mediawikiAccountPending.userId,
      set: {
        mwUsername: resolvedUsername,
        mwPasswordEncrypted,
      },
    });

  return {
    ok: true,
    account: {
      username: resolvedUsername,
      password,
      mwUserId: createData.createaccount?.userid ?? null,
      alreadyVerified: false,
    },
  };
}
