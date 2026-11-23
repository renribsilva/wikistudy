import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";

/** Rotas que exigem sessão autenticada (`session?.userId`). */
const protectedRoutes = ["/dashboard"];

/** Rotas públicas que redirecionam para `/dashboard` quando o usuário já está autenticado. */
const publicRoutes = ["/login", "/signup", "/"];

/**
 * Intercepta as requisições elegíveis pelo `config.matcher` e aplica regras de
 * redirecionamento entre rotas protegidas e públicas com base no cookie `session`.
 *
 * @param req - Requisição HTTP recebida (`NextRequest`).
 * @returns Resposta de redirecionamento (`NextResponse.redirect`) ou continuação (`NextResponse.next`).
 */
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId && !path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

/**
 * Configuração de caminhos nos quais o `proxy` é executado, excluindo rotas de API,
 * assets estáticos do Next.js e imagens `.png`.
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
