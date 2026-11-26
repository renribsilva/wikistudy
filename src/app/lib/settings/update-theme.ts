"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/app/lib/database/db";
import { userPreferences } from "@/app/lib/database/schema";
import { getUser } from "../authorization/dal";
import { OPTIONAL_THEMES, OptionalTheme } from "../themes/themes-config";

export async function updateUserTheme(nextTheme: OptionalTheme | null) {
  if (nextTheme !== null && !OPTIONAL_THEMES.includes(nextTheme)) {
    return { ok: false as const, error: "Tema inválido." };
  }

  const currentUser = await getUser();
  if (!currentUser?.id) {
    return { ok: false as const, error: "Não autenticado." };
  }

  const normalizedTheme: OptionalTheme | null = nextTheme;

  const [saved] = await db
    .insert(userPreferences)
    .values({
      userId: currentUser.id,
      theme: normalizedTheme,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: {
        theme: normalizedTheme,
        updatedAt: new Date(),
      },
    })
    .returning({ theme: userPreferences.theme });

  revalidatePath("/", "layout");
  revalidatePath("/account/appearance", "layout");
  revalidatePath("/dashboard", "layout");

  return { ok: true as const, theme: saved?.theme ?? null };
}
