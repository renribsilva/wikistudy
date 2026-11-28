import { eq } from "drizzle-orm";
import { db } from "@/app/lib/database/db";
import { mediawikiAccounts, users } from "@/app/lib/database/schema";

type ReactivateResult =
  | { ok: true; role: "colab"; mwUsername: string }
  | { ok: false; status: number; error: string };

export async function reactivateMediaWikiAccount(
  userId: string,
): Promise<ReactivateResult> {
  const existingAccount = await db.query.mediawikiAccounts.findFirst({
    where: eq(mediawikiAccounts.userId, userId),
    columns: { mwUsername: true },
  });

  const mwUsername = existingAccount?.mwUsername?.trim() ?? null;

  if (!mwUsername) {
    return {
      ok: false,
      status: 404,
      error: "Nenhuma conta MediaWiki vinculada anteriormente foi encontrada.",
    };
  }

  await db.update(users).set({ role: "colab" }).where(eq(users.id, userId));

  return {
    ok: true,
    role: "colab",
    mwUsername,
  };
}
