import "server-only";
import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * Recupera e valida o segredo de busca (`EMAIL_LOOKUP_SECRET`) do ambiente do servidor.
 *
 * @returns Buffer UTF-8 com o segredo usado no HMAC.
 */
function getLookupSecret(): Buffer {
  const secret = process.env.EMAIL_LOOKUP_SECRET?.trim();
  if (!secret) {
    throw new Error("EMAIL_LOOKUP_SECRET não configurada.");
  }
  return Buffer.from(secret, "utf8");
}

/**
 * Recupera e valida a chave de criptografia simétrica (`EMAIL_ENCRYPTION_KEY`).
 *
 * A chave deve estar em `base64` e decodificar para exatamente 32 bytes (256 bits).
 *
 * @returns Buffer de 32 bytes para uso com `AES-256-GCM`.
 */
function getEncryptionKey(): Buffer {
  const b64Key = process.env.EMAIL_ENCRYPTION_KEY?.trim();
  if (!b64Key) {
    throw new Error("EMAIL_ENCRYPTION_KEY não configurada.");
  }

  const key = Buffer.from(b64Key, "base64");
  if (key.length !== 32) {
    throw new Error(
      "EMAIL_ENCRYPTION_KEY deve decodificar para exatamente 32 bytes (256 bits).",
    );
  }

  return key;
}

/**
 * Normaliza um e-mail removendo espaços nas extremidades e convertendo para minúsculas.
 *
 * @param email - Endereço de e-mail bruto.
 * @returns E-mail normalizado (`trim().toLowerCase()`).
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Gera um blind index determinístico (`HMAC-SHA256` em hex) para o e-mail normalizado.
 *
 * Utilizado para buscas e restrição de unicidade no banco sem armazenar o e-mail
 * em texto puro.
 *
 * @param email - Endereço de e-mail a ser indexado.
 * @returns Hash HMAC-SHA256 em formato hexadecimal.
 */
export function createEmailBlindIndex(email: string): string {
  const normalized = normalizeEmail(email);
  return crypto
    .createHmac("sha256", getLookupSecret())
    .update(normalized)
    .digest("hex");
}

/**
 * Cifra o e-mail normalizado usando `AES-256-GCM`.
 *
 * ATENÇÃO: Esta criptografia é **reversível** por meio de `decryptEmail` utilizando
 * a `EMAIL_ENCRYPTION_KEY`. Quem tiver acesso à chave no ambiente do servidor e ao
 * valor cifrado pode recuperar o e-mail em texto puro.
 *
 * @param email - Endereço de e-mail a ser cifrado.
 * @returns Payload codificado em `base64url` contendo `IV + authTag + ciphertext`.
 */
export function encryptEmail(email: string): string {
  const normalized = normalizeEmail(email);
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  const encrypted = Buffer.concat([
    cipher.update(normalized, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

/**
 * Reverte a criptografia `AES-256-GCM` e recupera o e-mail normalizado em texto puro.
 *
 * Requer a mesma `EMAIL_ENCRYPTION_KEY` usada na cifragem e valida a `authTag`
 * para garantir a integridade do payload.
 *
 * @param payload - String `base64url` gerada por `encryptEmail`.
 * @returns E-mail descriptografado em UTF-8.
 */
export function decryptEmail(payload: string): string {
  const key = getEncryptionKey();
  const data = Buffer.from(payload, "base64url");

  if (data.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error("Payload de e-mail criptografado inválido.");
  }

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
