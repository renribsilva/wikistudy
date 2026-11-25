"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/app/lib/database/db";
import { users } from "@/app/lib/database/schema";
import { getUser } from "../authorization/dal";

export async function updateAvatarFace(faceId: number) {
  if (
    typeof faceId !== "number" ||
    !Number.isInteger(faceId) ||
    faceId < 1 ||
    faceId > 6
  ) {
    return { ok: false as const, error: "Face inválida." };
  }

  const currentUser = await getUser();
  if (!currentUser?.id) {
    return { ok: false as const, error: "Não autenticado." };
  }

  const updated = await db
    .update(users)
    .set({ avatarFace: faceId })
    .where(eq(users.id, currentUser.id))
    .returning({ id: users.id, avatarFace: users.avatarFace });

  if (updated.length === 0) {
    return { ok: false as const, error: "Usuário não encontrado." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/account/settings", "layout");

  return { ok: true as const, avatarFace: updated[0].avatarFace };
}
