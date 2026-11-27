import "server-only";
import crypto from "node:crypto";

const MW_CIPHER_ALGORITHM = "aes-256-gcm";
const MW_IV_BYTES = 12;
const MW_AUTH_TAG_BYTES = 16;

/**
 * Lê e valida a chave simétrica (`MW_PASSWORD_ENCRYPTION_KEY`) usada para cifrar
 * e decifrar senhas de contas MediaWiki no servidor.
 *
 * A chave deve estar codificada em `base64` e decodificar para 32 bytes (256 bits).
 *
 * @returns Buffer de 32 bytes pronto para o `AES-256-GCM`.
 */
function getMwPasswordEncryptionKey(): Buffer {
  const encodedKey = process.env.MW_PASSWORD_ENCRYPTION_KEY?.trim();
  if (!encodedKey) {
    throw new Error("MW_PASSWORD_ENCRYPTION_KEY não configurada.");
  }

  const key = Buffer.from(encodedKey, "base64");
  if (key.length !== 32) {
    throw new Error(
      "MW_PASSWORD_ENCRYPTION_KEY deve decodificar para exatamente 32 bytes (256 bits).",
    );
  }

  return key;
}

/**
 * Cifra a senha da conta MediaWiki usando `AES-256-GCM` para persistência em
 * `mediawiki_accounts.mw_password_encrypted`.
 *
 * Esta cifragem é reversível no servidor por meio de `decryptMwPassword` com a
 * mesma `MW_PASSWORD_ENCRYPTION_KEY`, pois a API do MediaWiki exige a senha em
 * texto claro em operações autenticadas subsequentes.
 *
 * @param plainPassword - Senha da conta MediaWiki em texto puro.
 * @returns Payload em `base64url` no formato `IV + authTag + ciphertext`.
 */
export function encryptMwPassword(plainPassword: string): string {
  if (!plainPassword) {
    throw new Error("Senha da conta MediaWiki não pode ser vazia.");
  }

  const key = getMwPasswordEncryptionKey();
  const iv = crypto.randomBytes(MW_IV_BYTES);

  const cipher = crypto.createCipheriv(MW_CIPHER_ALGORITHM, key, iv, {
    authTagLength: MW_AUTH_TAG_BYTES,
  });

  const ciphertext = Buffer.concat([
    cipher.update(plainPassword, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, ciphertext]).toString("base64url");
}

/**
 * Decifra o payload `base64url` gerado por `encryptMwPassword` e valida a
 * integridade autenticada via `authTag` do `AES-256-GCM`.
 *
 * @param encryptedPayload - Valor armazenado em `mediawiki_accounts.mw_password_encrypted`.
 * @returns Senha da conta MediaWiki em UTF-8.
 */
export function decryptMwPassword(encryptedPayload: string): string {
  const key = getMwPasswordEncryptionKey();
  const rawBuffer = Buffer.from(encryptedPayload, "base64url");

  if (rawBuffer.length < MW_IV_BYTES + MW_AUTH_TAG_BYTES + 1) {
    throw new Error("Payload de senha MediaWiki criptografada inválido.");
  }

  const iv = rawBuffer.subarray(0, MW_IV_BYTES);
  const authTag = rawBuffer.subarray(
    MW_IV_BYTES,
    MW_IV_BYTES + MW_AUTH_TAG_BYTES,
  );
  const ciphertext = rawBuffer.subarray(MW_IV_BYTES + MW_AUTH_TAG_BYTES);

  const decipher = crypto.createDecipheriv(MW_CIPHER_ALGORITHM, key, iv, {
    authTagLength: MW_AUTH_TAG_BYTES,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
