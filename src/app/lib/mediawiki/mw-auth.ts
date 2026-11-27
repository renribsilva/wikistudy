//Verifica se as credenciais do MediaWiki estão operacionais
import "server-only";

import {
  buildCookieHeader,
  extractCookieHeader,
  isTimeoutOrAbortError,
  MW_API_URL,
  MW_REQUEST_TIMEOUT_MS,
  parseMediaWikiJsonResponse,
  USER_AGENT,
} from "./mw-http";

export type MwLoginResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function verifyMediaWikiCredentials(
  username: string,
  password: string,
): Promise<MwLoginResult> {
  const cookieJar = new Map<string, string>();

  const tokenUrl = new URL(MW_API_URL);
  tokenUrl.searchParams.set("action", "query");
  tokenUrl.searchParams.set("meta", "tokens");
  tokenUrl.searchParams.set("type", "login");
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
  } catch (err) {
    const timeout = isTimeoutOrAbortError(err);
    return {
      ok: false,
      status: timeout ? 504 : 502,
      error: timeout
        ? "Tempo limite ao solicitar token de autenticação do MediaWiki."
        : "Falha de comunicação com o MediaWiki.",
    };
  }

  extractCookieHeader(tokenRes, cookieJar);

  if (!tokenRes.ok) {
    return {
      ok: false,
      status: 502,
      error: `Falha ao obter token de login (HTTP ${tokenRes.status}).`,
    };
  }

  const parsedToken = await parseMediaWikiJsonResponse(
    tokenRes,
    "obter token de autenticação",
  );
  if (!parsedToken.ok) {
    return {
      ok: false,
      status: 502,
      error: parsedToken.error,
    };
  }

  const tokenData = parsedToken.data as {
    query?: { tokens?: { logintoken?: string } };
  };
  const loginToken = tokenData.query?.tokens?.logintoken;

  if (!loginToken) {
    return {
      ok: false,
      status: 502,
      error: "O MediaWiki não forneceu o token de autenticação.",
    };
  }

  const formBody = new URLSearchParams({
    action: "login",
    lgname: username,
    lgpassword: password,
    lgtoken: loginToken,
    format: "json",
    formatversion: "2",
  });

  let loginRes: Response;
  try {
    loginRes = await fetch(MW_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": USER_AGENT,
        Cookie: buildCookieHeader(cookieJar),
      },
      body: formBody.toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(MW_REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    const timeout = isTimeoutOrAbortError(err);
    return {
      ok: false,
      status: timeout ? 504 : 502,
      error: timeout
        ? "Tempo limite ao autenticar no MediaWiki."
        : "Falha de comunicação durante a autenticação no MediaWiki.",
    };
  }

  extractCookieHeader(loginRes, cookieJar);

  if (!loginRes.ok) {
    return {
      ok: false,
      status: 502,
      error: `Falha na requisição de autenticação (HTTP ${loginRes.status}).`,
    };
  }

  const parsedLogin = await parseMediaWikiJsonResponse(
    loginRes,
    "autenticar conta no MediaWiki",
  );
  if (!parsedLogin.ok) {
    return {
      ok: false,
      status: 502,
      error: parsedLogin.error,
    };
  }

  const loginData = parsedLogin.data as {
    login?: {
      result?: string;
      reason?: string;
      message?: string;
    };
  };

  if (loginData.login?.result !== "Success") {
    console.warn("[MediaWiki] Falha na verificação de credenciais:", {
      username,
      result: loginData.login?.result ?? "UNKNOWN",
      reason: loginData.login?.reason,
    });

    return {
      ok: false,
      status: 401,
      error:
        loginData.login?.reason ??
        loginData.login?.message ??
        `O MediaWiki não confirmou a autenticação (resultado: ${loginData.login?.result ?? "desconhecido"}).`,
    };
  }

  console.info("[MediaWiki] Autenticação confirmada:", username);
  return { ok: true };
}
