import { NextResponse } from "next/server";
import { verifySession } from "@/app/lib/authorization/dal";
import { createMediaWikiAccountForUser } from "@/app/lib/mediawiki/account-services/account-service";

export async function POST() {
  try {
    // Se não houver sessão válida, verifySession() já redireciona para /login ou / conforme sua DAL
    const { userId } = await verifySession();

    const result = await createMediaWikiAccountForUser(userId);
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err) {
      throw err;
    }

    if (err instanceof Error) {
      console.error("[POST /api/mediawiki/create-account]", {
        name: err.name,
        message: err.message,
        stack: err.stack,
        cause: err.cause,
      });
    } else {
      console.error(
        "[POST /api/mediawiki/create-account] Erro desconhecido:",
        err,
      );
    }

    return NextResponse.json(
      { ok: false, error: "Erro interno ao processar a conta na wiki." },
      { status: 500 },
    );
  }
}
