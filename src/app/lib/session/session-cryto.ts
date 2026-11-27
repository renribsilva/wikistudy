"use server";

import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@/app/lib/database/schema";
import { SessionPayload } from "./definitions";

/** Nome do cookie HTTP-only que armazena o token JWT de sessão. */
const SESSION_COOKIE_NAME = "session";

/** Tempo de validade criptográfica do token JWT (`24h`). */
const SESSION_EXPIRATION = "24h";

/**
 * Opções padrão de segurança do cookie de sessão.
 *
 * @remarks
 * Sem `maxAge` ou `expires` explícitos, o navegador trata o cookie como um
 * **session cookie** (removido ao encerrar a sessão do navegador, salvo se o
 * recurso de restauração de abas estiver ativo), enquanto a expiração real
 * de 24h é garantida pelo claim `exp` dentro do JWT.
 */
const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

/**
 * Recupera, valida e codifica a chave secreta de sessão (`SESSION_SECRET`).
 *
 * Exige que `SESSION_SECRET` esteja definida nas variáveis de ambiente e possua
 * ao menos 32 caracteres (256 bits) para assinatura simétrica `HS256`.
 *
 * @throws {Error} Se `SESSION_SECRET` estiver ausente ou tiver menos de 32 caracteres.
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
 * Assina e gera um token JWT (`HS256`) com o payload da sessão, `iat` e expiração (`exp`) de 24h.
 *
 * @param payload - Dados embarcados na sessão (inclui `userId` e opcionalmente `role`).
 * @returns Token JWT assinado válido por 24 horas.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(getEncodedKey());
}

/**
 * Verifica a assinatura, o algoritmo (`HS256`), o prazo de expiração (`exp`) e a integridade
 * mínima do payload (`userId`) de um token JWT de sessão.
 *
 * @param session - Valor bruto do cookie `session` a ser verificado.
 * @returns Payload tipado (`SessionPayload`) se válido e dentro do prazo, ou `null` caso contrário.
 *
 * @remarks
 * Falhas de assinatura, expiração, token malformado ou `userId` ausente/inválido são
 * capturadas e retornam `null` para facilitar o tratamento em guards, DAL e Server Actions.
 */
export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ["HS256"],
    });

    if (typeof payload.userId !== "string" || payload.userId.length === 0) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Cria a sessão do usuário, gera um JWT válido por 24h e grava o cookie de sessão no navegador.
 *
 * @param userId - Identificador único do usuário autenticado (UUIDv7 em `string`).
 * @param role - Papel inicial opcional do usuário (`user`, `colab` ou `admin`) embutido no token.
 *
 * @remarks
 * Deve ser chamada apenas em contextos mutáveis de cookies (Server Actions ou Route Handlers).
 */
export async function createSession(
  userId: string,
  role?: UserRole,
): Promise<void> {
  const session = await encrypt({
    userId,
    ...(role ? { role } : {}),
  });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, session, SESSION_COOKIE_OPTIONS);
}

/**
 * Reemite a sessão emitindo um novo JWT com `iat` atualizado, nova janela de expiração de 24h
 * e atualização opcional do papel (`role`) do usuário.
 *
 * @param nextRole - Novo papel do usuário (`user`, `colab` ou `admin`) para substituir o anterior;
 * quando omitido, preserva o `role` já presente no payload atual.
 * @returns `null` caso não exista sessão válida para renovar.
 *
 * @remarks
 * Útil para expiração deslizante (*sliding session*) ou para refletir promoções de papel
 * (como passar de `user` para `colab` após vincular conta no MediaWiki) imediatamente no cookie.
 * Deve ser chamada apenas em contextos mutáveis de cookies (Server Actions, Route Handlers ou Proxy/Middleware).
 */
export async function updateSession(nextRole?: UserRole): Promise<void | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const payload = await decrypt(session);

  if (!session || !payload?.userId) {
    return null;
  }

  const resolvedRole = nextRole ?? payload.role;
  const renewedSession = await encrypt({
    userId: String(payload.userId),
    ...(resolvedRole ? { role: resolvedRole } : {}),
  });

  cookieStore.set(SESSION_COOKIE_NAME, renewedSession, SESSION_COOKIE_OPTIONS);
}

/**
 * Encerra a sessão removendo o cookie `session` do navegador.
 *
 * @remarks
 * Deve ser chamada em contextos mutáveis de cookies (Server Actions ou Route Handlers).
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Encerra a sessão atual removendo o cookie e redireciona o usuário para `/login`.
 *
 * @remarks
 * O `redirect("/login")` é executado após `deleteSession()` fora de bloco `try/catch`
 * para que a exceção interna de redirecionamento do Next.js propague corretamente.
 */
export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/login");
}
