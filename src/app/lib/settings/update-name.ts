"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/app/lib/database/db";
import { users } from "@/app/lib/database/schema";
import { getUser } from "../authorization/dal";

export async function updateUserName(name: string) {
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return {
      ok: false as const,
      error: "O nome deve ter entre 2 e 60 caracteres.",
    };
  }

  const currentUser = await getUser();
  if (!currentUser?.id) {
    return { ok: false as const, error: "Não autenticado." };
  }

  const updated = await db
    .update(users)
    .set({ name: trimmedName })
    .where(eq(users.id, currentUser.id))
    .returning({ id: users.id, name: users.name });

  if (updated.length === 0) {
    return { ok: false as const, error: "Usuário não encontrado." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/account/settings", "layout");

  return { ok: true as const, name: updated[0].name };
}
