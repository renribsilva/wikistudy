import type { JWTPayload } from "jose";

export interface SessionPayload extends JWTPayload {
  /** Identificador único do usuário autenticado. */
  userId: string;
}
