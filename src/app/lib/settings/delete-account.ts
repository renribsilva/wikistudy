"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/app/lib/database/db";
import { users } from "@/app/lib/database/schema";
import { getUser } from "../authorization/dal";

export async function deleteAccount() {
  const currentUser = await getUser();
  if (!currentUser?.id) {
    return { ok: false as const, error: "Não autenticado." };
  }

  const deleted = await db
    .delete(users)
    .where(eq(users.id, currentUser.id))
    .returning({ id: users.id });

  if (deleted.length === 0) {
    return { ok: false as const, error: "Usuário não encontrado." };
  }

  const cookieStore = await cookies();
  cookieStore.delete("session");

  revalidatePath("/", "layout");
  redirect("/login");
}
