//Comunicação HTTP, cookies e interpretação de respostas.
import "server-only";

export const MW_API_URL = "https://mediawikistudy.onrender.com/api.php";
export const USER_AGENT = "WikiStudyNextJS/1.0";
// 1min30 por requisição para cobrir cold start de instância gratuita no Render
export const MW_REQUEST_TIMEOUT_MS = 90000;

export type ParsedJsonResult =
  | { ok: true; data: Record<string, unknown>; error?: undefined }
  | { ok: false; data?: undefined; error: string };

export async function parseMediaWikiJsonResponse(
  res: Response,
  contextLabel: string,
): Promise<ParsedJsonResult> {
  const rawText = await res.text();

  try {
    const parsed: unknown = JSON.parse(rawText);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {
        ok: false,
        error: `Resposta JSON inesperada do MediaWiki ao ${contextLabel}.`,
      };
    }
    return {
      ok: true,
      data: parsed as Record<string, unknown>,
    };
  } catch {
    const snippet = rawText.trim().slice(0, 160);
    console.error(
      `[MediaWiki non-JSON response] ${contextLabel} (HTTP ${res.status}):`,
      snippet,
    );
    return {
      ok: false,
      error: `O MediaWiki retornou uma resposta inválida (não-JSON) ao ${contextLabel} (HTTP ${res.status}).`,
    };
  }
}

export function buildCookieHeader(currentCookies: Map<string, string>): string {
  return Array.from(currentCookies.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

export function extractCookieHeader(
  res: Response,
  currentCookies: Map<string, string>,
): string {
  const headersWithGetSetCookie = res.headers as Headers & {
    getSetCookie?: () => string[];
  };

  const setCookies = headersWithGetSetCookie.getSetCookie
    ? headersWithGetSetCookie.getSetCookie()
    : [];

  for (const cookieLine of setCookies) {
    const firstPart = cookieLine.split(";")[0];
    const eqIndex = firstPart.indexOf("=");
    if (eqIndex > 0) {
      const name = firstPart.slice(0, eqIndex).trim();
      const value = firstPart.slice(eqIndex + 1).trim();
      currentCookies.set(name, value);
    }
  }

  return buildCookieHeader(currentCookies);
}

export function isTimeoutOrAbortError(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.name === "TimeoutError" || err.name === "AbortError")
  );
}
