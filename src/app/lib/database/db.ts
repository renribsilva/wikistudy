import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/app/lib/database/schema";

/**
 * Cliente HTTP do Neon configurado com a string de conexão do servidor.
 *
 * Restrito ao lado do servidor via `server-only` para evitar exposição da
 * `DATABASE_URL` no bundle do cliente.
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Instância tipada do Drizzle ORM utilizada para operações no banco de dados
 * em Server Actions, DAL e DTOs, com o `schema` registrado.
 */
export const db = drizzle({ client: sql, schema });
