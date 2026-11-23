import "server-only";
import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getLookupSecret(): Buffer {
  const secret = process.env.EMAIL_LOOKUP_SECRET?.trim();
  if (!secret) {
    throw new Error("EMAIL_LOOKUP_SECRET não configurada.");
  }
  return Buffer.from(secret, "utf8");
}

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

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createEmailBlindIndex(email: string): string {
  const normalized = normalizeEmail(email);
  return crypto
    .createHmac("sha256", getLookupSecret())
    .update(normalized)
    .digest("hex");
}

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
