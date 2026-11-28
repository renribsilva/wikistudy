import { NextResponse } from "next/server";
import { verifySession } from "@/app/lib/authorization/dal";
import { disconnectMediaWikiAccount } from "@/app/lib/mediawiki/account-services/account-disconnection";
import { updateSession } from "@/app/lib/session/session-cryto";

export async function POST() {
  try {
    const { userId } = await verifySession();

    const result = await disconnectMediaWikiAccount(userId);

    if (result.ok === false) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error,
        },
        { status: result.status },
      );
    }

    await updateSession(result.role);

    return NextResponse.json({
      ok: true,
      role: result.role,
      message: "Conta MediaWiki desvinculada com sucesso.",
    });
  } catch (err) {
    if (typeof err === "object" && err !== null && "digest" in err) {
      throw err;
    }

    console.error("[POST /api/mediawiki/unlink-account]", err);

    return NextResponse.json(
      {
        ok: false,
        error: "Erro interno ao desvincular a conta MediaWiki.",
      },
      { status: 500 },
    );
  }
}
