import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const OAUTH_STATE_COOKIE = "google_oauth_state";
const STATE_MAX_AGE_SECONDS = 60 * 10; // 10 minutos

/**
 * Inicia o fluxo OAuth 2.0 / OpenID Connect com o Google.
 *
 * Gera um `state` aleatório armazenado em cookie `httpOnly` para validar o
 * retorno no callback e redireciona o navegador para a tela de consentimento.
 *
 * @param req - Requisição HTTP recebida (`NextRequest`).
 * @returns Resposta de redirecionamento para o Google ou para `/login` em caso de falha de configuração.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();
  const loginUrl = new URL("/login", req.nextUrl.origin);

  if (!clientId || !redirectUri) {
    loginUrl.searchParams.set("error", "oauth_config");
    return NextResponse.redirect(loginUrl);
  }

  const state = crypto.randomBytes(32).toString("base64url");

  const authUrl = new URL(GOOGLE_AUTH_URL);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(authUrl.toString());

  res.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_MAX_AGE_SECONDS,
    path: "/",
  });

  return res;
}
