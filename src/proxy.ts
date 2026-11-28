import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session/session-cryto";

/**
 * Rotas públicas de autenticação que redirecionam para `/dashboard` quando o
 * usuário já possui uma sessão válida.
 */
const authRoutes: string[] = ["/login", "/signup"];

/**
 * Lista explícita de rotas protegidas que exigem sessão autenticada
 * (`session.userId`). Pode conter rotas exatas ou prefixos de subrotas.
 */
const protectedRoutes: string[] = ["/dashboard/account"];

/**
 * Verifica se o caminho informado corresponde a alguma rota configurada em
 * `protectedRoutes` (exata ou como prefixo de subrota com `/`).
 *
 * @param path - Caminho da URL requisitada (`req.nextUrl.pathname`).
 * @returns `true` se a rota exigir autenticação; caso contrário, `false`.
 */
function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

/**
 * Intercepta as requisições elegíveis pelo `config.matcher` para controlar o
 * fluxo de navegação e autenticação no nível do `proxy`:
 * - Redireciona a raiz (`/`) para `/dashboard`.
 * - Bloqueia acesso não autenticado às rotas em `protectedRoutes` (incluindo
 *   subrotas), redirecionando para `/login` com `callbackUrl` preservado.
 * - Redireciona usuários já autenticados que acessam `/login` ou `/signup`
 *   para `/dashboard`.
 *
 * @param req - Requisição HTTP recebida (`NextRequest`).
 * @returns Resposta de redirecionamento (`NextResponse.redirect`) ou continuação
 *   do fluxo (`NextResponse.next`).
 */
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  const requiresAuth = isProtectedRoute(path);
  const isAuthRoute = authRoutes.includes(path);

  if (!requiresAuth && !isAuthRoute) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (requiresAuth && !session?.userId) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

/**
 * Configuração de caminhos nos quais o `proxy` é executado, excluindo rotas de
 * API (`/api`), assets internos do Next.js (`/_next/static`, `/_next/image`) e
 * arquivos estáticos `.png`.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
