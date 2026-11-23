"use server";

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionPayload } from "@/app/lib/definitions";

const SESSION_COOKIE_NAME = "session";

/**
 * Recupera, valida e codifica a chave secreta de sessão (`SESSION_SECRET`).
 *
 * Exige que `SESSION_SECRET` esteja definida e possua ao menos 32 caracteres.
 *
 * @returns `Uint8Array` codificado em UTF-8 para assinatura e verificação JWT.
 */
function getEncodedKey(): Uint8Array {
  const secretKey = process.env.SESSION_SECRET?.trim();
  if (!secretKey || secretKey.length < 32) {
    throw new Error(
      "SESSION_SECRET deve estar configurada e ter pelo menos 32 caracteres.",
    );
  }
  return new TextEncoder().encode(secretKey);
}

/**
 * Assina e gera um token JWT (`HS256`) com o payload da sessão e `iat`.
 *
 * Não define expiração explícita (`exp`).
 *
 * @param payload - Dados embarcados na sessão (inclui `userId`).
 * @returns Token JWT assinado.
 */
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(getEncodedKey());
}

/**
 * Verifica a assinatura e o algoritmo (`HS256`) de um token JWT de sessão.
 *
 * @param session - Valor do cookie `session` a ser verificado.
 * @returns Payload tipado (`SessionPayload`) se válido, ou `null` em caso de falha/ausência.
 */
export async function decrypt(session: string | undefined = "") {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Cria a sessão do usuário e grava o cookie `session` com flags de segurança.
 *
 * @param userId - Identificador único do usuário autenticado (UUIDv7 em `string`).
 */
export async function createSession(userId: string) {
  const session = await encrypt({ userId });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Reemite o JWT de sessão com um novo `iat` e atualiza o cookie `session`.
 *
 * Deve ser chamada apenas em contextos mutáveis de cookies (Server Actions,
 * Route Handlers ou Proxy/Middleware).
 *
 * @returns `null` caso não exista sessão válida para renovar.
 */
export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await decrypt(session);

  if (!session || !payload?.userId) {
    return null;
  }

  const renewedSession = await encrypt({
    userId: String(payload.userId),
  });

  cookieStore.set(SESSION_COOKIE_NAME, renewedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Remove o cookie `session` do navegador.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Encerra a sessão atual removendo o cookie e redireciona o usuário para `/login`.
 *
 * O `redirect` é executado após `deleteSession()` fora de `try/catch` para
 * respeitar o mecanismo de redirecionamento do Next.js.
 */
export async function logout() {
  await deleteSession();
  redirect("/login");
}
