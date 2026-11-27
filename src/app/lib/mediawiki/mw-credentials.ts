//Geração de usuário e senha para o MediaWiki
import "server-only";
import crypto from "node:crypto";

export function toValidMwUsername(rawId: string): string {
  // Remove espaços e underscores para evitar que o MediaWiki converta '_' em espaço
  const compact = rawId
    .trim()
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .slice(0, 60);

  const base = compact || "Usuario";
  const candidate = `WS${base}`;
  return candidate.charAt(0).toUpperCase() + candidate.slice(1);
}

export function generateMwPassword(): string {
  // Garante maiúscula, minúscula, número e símbolo para atender políticas de senha do MediaWiki
  const randomPart = crypto.randomBytes(18).toString("base64url");
  return `Ws#${randomPart}aA1`;
}
