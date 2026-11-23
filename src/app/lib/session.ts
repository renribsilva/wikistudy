"use server";

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SessionPayload } from "@/app/lib/definitions";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Assina e gera um token JWT (HS256) contendo os dados da sessão.
 *
 * @param payload - Dados que serão embarcados no token de sessão.
 * @returns Token JWT assinado em formato string.
 *
 * @remarks
 * O token não define expiração automática (`exp`) e registra apenas o
 * carimbo de emissão (`iat`). Garanta que `SESSION_SECRET` esteja configurado
 * com um valor forte no ambiente server-side.
 */
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(encodedKey);
}

/**
 * Valida a assinatura de um JWT de sessão e retorna seu payload.
 *
 * @param session - Token JWT recuperado do cookie de sessão.
 * @returns O `SessionPayload` decodificado se válido, ou `null` em caso de falha.
 *
 * @remarks
 * Falhas de assinatura ou token malformado são capturadas silenciosamente e
 * retornam `null` para facilitar o tratamento em guards/Server Actions.
 */
export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    console.log("Failed to verify session");
    return null;
  }
}

/**
 * Cria a sessão do usuário e grava o cookie `session` no navegador.
 *
 * @param userId - Identificador único do usuário autenticado.
 *
 * @remarks
 * Como não há `expires` ou `maxAge` definidos, o cookie funciona como cookie
 * de sessão do navegador (`httpOnly`, `sameSite: "lax"`, `secure` em produção).
 */
export async function createSession(userId: string) {
  const session = await encrypt({ userId });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Reemite o token de sessão com um novo `iat` e atualiza o cookie `session`.
 *
 * @returns `null` se não houver sessão válida para renovar; caso contrário, atualiza o cookie.
 *
 * @remarks
 * Só deve ser chamada em contextos onde o Next.js permite modificar cookies
 * (como Server Actions ou Route Handlers), não dentro de Server Components.
 */
export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload?.userId) {
    return null;
  }

  const renewedSession = await encrypt({
    userId: String(payload.userId),
  });

  cookieStore.set("session", renewedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Remove o cookie `session` encerrando a sessão no navegador.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * Encerra a sessão atual e redireciona o usuário para `/login`.
 *
 * @remarks
 * Chama `redirect("/login")`, que lança uma exceção interna do Next.js para
 * interromper a execução e realizar o redirecionamento.
 */
export async function logout() {
  await deleteSession();
  redirect("/login");
}
