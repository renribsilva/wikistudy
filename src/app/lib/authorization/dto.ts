import "server-only";
import { getUser } from "./dal";

/**
 * Representa o usuário autenticado que está solicitando a visualização de um perfil.
 */
type Viewer = NonNullable<Awaited<ReturnType<typeof getUser>>>;

/**
 * Determina se o visualizador autenticado pode visualizar o nome do perfil.
 *
 * @param viewer - Usuário autenticado atual.
 * @returns `true` se o visualizador possuir um `id` válido.
 */
function canSeeName(viewer: Viewer) {
  return Boolean(viewer.id);
}

/**
 * Determina se o visualizador autenticado pode visualizar o e-mail do perfil alvo.
 *
 * Restringe a visualização do e-mail ao próprio titular do perfil.
 *
 * @param viewer - Usuário autenticado atual.
 * @param profileUserId - Identificador (UUIDv7) do perfil consultado.
 * @returns `true` apenas quando `viewer.id` coincide com `profileUserId`.
 */
function canSeeEmail(viewer: Viewer, profileUserId: string) {
  return viewer.id === profileUserId;
}

/**
 * Retorna o DTO seguro do perfil do usuário autenticado a partir do `targetUserId` (UUIDv7).
 *
 * Valida a sessão via `getUser()`, garante que o usuário só acesse o próprio perfil,
 * descriptografa o e-mail no servidor quando permitido por `canSeeEmail` e omite
 * campos sensíveis como `password`, `emailBlindIndex` e `emailEncrypted`.
 *
 * @param targetUserId - Identificador único (UUIDv7) do perfil solicitado.
 * @returns Objeto `{ id, name, email }` ou `null` se não autorizado ou não encontrado.
 */
export async function getProfileDTO(targetUserId: string) {
  const currentUser = await getUser();
  if (!currentUser) return null;
  if (currentUser.id !== targetUserId) return null;

  return {
    id: currentUser.id,
    name: canSeeName(currentUser) ? currentUser.name : null,
    email: canSeeEmail(currentUser, currentUser.id) ? currentUser.email : null,
  };
}
