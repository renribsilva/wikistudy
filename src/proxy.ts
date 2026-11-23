import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/identity/session/session";

/** Rotas que redirecionam para `/dashboard` quando o usuário já está autenticado. */
const authRoutes = ["/login", "/signup"];

/**
 * Intercepta as requisições elegíveis pelo `config.matcher`:
 * - Redireciona a raiz (`/`) para `/dashboard`.
 * - Redireciona rotas de autenticação (`/login`, `/signup`) para `/dashboard`
 *   quando já existe sessão válida.
 *
 * @param req - Requisição HTTP recebida (`NextRequest`).
 * @returns Resposta de redirecionamento (`NextResponse.redirect`) ou continuação (`NextResponse.next`).
 */
export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (authRoutes.includes(path)) {
    const cookie = req.cookies.get("session")?.value;
    const session = await decrypt(cookie);

    if (session?.userId) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
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
