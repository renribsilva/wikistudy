import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { decrypt } from "@/app/lib/session";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";

//valida a sessão (verifySession) e
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: String(session.userId) };
});

//busca o usuário logado (getUser).
export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, Number(session.userId)),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });

    const user = data[0];

    return user ?? null;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});
