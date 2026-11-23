import type { JWTPayload } from "jose";

/**
 * Payload embarcado no JWT de sessão da aplicação.
 *
 * Estende `JWTPayload` do `jose` para incluir o identificador único do usuário
 * autenticado (`userId`).
 */
export interface SessionPayload extends JWTPayload {
  /** Identificador único do usuário autenticado (UUIDv7). */
  userId: string;
}
