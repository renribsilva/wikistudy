import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  createEmailBlindIndex,
  encryptEmail,
} from "@/app/lib/auth/email-crypto";
import { db } from "@/app/lib/database/db";
import { users } from "@/app/lib/database/schema";
import { createSession } from "@/app/lib/session/session-cryto";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";
const OAUTH_STATE_COOKIE = "google_oauth_state";

interface GoogleTokenResponse {
  access_token?: string;
}

interface GoogleUserInfo {
  email?: string;
  email_verified?: boolean;
  name?: string;
}

function redirectToLogin(origin: string, errorCode: string): NextResponse {
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("error", errorCode);
  const res = NextResponse.redirect(loginUrl);
  res.cookies.delete(OAUTH_STATE_COOKIE);
  return res;
}

/**
 * Processa o retorno do Google OAuth 2.0 / OpenID Connect, cria ou localiza
 * o usuário no banco, abre a sessão (`session`) e redireciona para `/dashboard`.
 */
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");

  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim();

  if (oauthError) {
    return redirectToLogin(origin, "google_denied");
  }

  const storedState = req.cookies.get(OAUTH_STATE_COOKIE)?.value;
  if (
    !code ||
    !state ||
    !storedState ||
    state.length !== storedState.length ||
    !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))
  ) {
    return redirectToLogin(origin, "invalid_state");
  }

  if (!clientId || !clientSecret || !redirectUri) {
    return redirectToLogin(origin, "oauth_config");
  }

  try {
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    if (!tokenRes.ok) {
      return redirectToLogin(origin, "token_exchange");
    }

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenData.access_token) {
      return redirectToLogin(origin, "missing_token");
    }

    const userInfoRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    });

    if (!userInfoRes.ok) {
      return redirectToLogin(origin, "userinfo_failed");
    }

    const profile = (await userInfoRes.json()) as GoogleUserInfo;
    const normalizedEmail = profile.email?.trim().toLowerCase();

    if (!normalizedEmail || profile.email_verified === false) {
      return redirectToLogin(origin, "unverified_email");
    }

    const emailBlindIndex = createEmailBlindIndex(normalizedEmail);
    const emailEncrypted = encryptEmail(normalizedEmail);
    const displayName = profile.name?.trim() || normalizedEmail.split("@")[0];

    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.emailBlindIndex, emailBlindIndex))
      .limit(1);

    let userId = existing[0]?.id;

    if (!userId) {
      const inserted = await db
        .insert(users)
        .values({
          name: displayName,
          emailBlindIndex,
          emailEncrypted,
          password: null,
        })
        .returning({ id: users.id });

      userId = inserted[0]?.id;
    }

    if (!userId) {
      return redirectToLogin(origin, "user_create_failed");
    }

    await createSession(String(userId));

    const dashboardUrl = new URL("/dashboard", origin);
    const res = NextResponse.redirect(dashboardUrl);
    res.cookies.delete(OAUTH_STATE_COOKIE);
    return res;
  } catch (err) {
    console.error("[google-oauth-callback]", err);
    return redirectToLogin(origin, "oauth_unexpected");
  }
}
