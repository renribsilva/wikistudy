"use server";

import { redirect } from "next/navigation";
import { deleteSession } from "./session-cryto";

/**
 * Encerra a sessão atual removendo o cookie e redireciona o usuário para `/login`.
 *
 * O `redirect` é executado após `deleteSession()` fora de `try/catch` para
 * respeitar o mecanismo de redirecionamento do Next.js.
 */
export async function logout() {
  await deleteSession();
  redirect("/");
}
