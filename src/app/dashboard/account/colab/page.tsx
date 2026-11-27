import { eq } from "drizzle-orm";
import Link from "next/link";
import { getOptionalUser } from "@/app/lib/authorization/dal";
import { mediawikiAccounts } from "@/app/lib/database/schema";
import { CreateWikiAccountButton } from "@/components/tsx/buttons/colab-button";
import styles from "./colab.module.css";
import { db } from "@/app/lib/database/db";

export default async function ColabPage() {
  const user = await getOptionalUser();

  const existingAccount = user?.id
    ? await db.query.mediawikiAccounts.findFirst({
        where: eq(mediawikiAccounts.userId, user.id),
        columns: { mwUsername: true },
      })
    : null;

  return (
    <main className={styles.colab_wrapper}>
      <header className={styles.colab_header}>
        <h1 className={styles.colab_title}>Ser um colaborador na WikiStudy</h1>
        <p className={styles.colab_subtitle}>
          Crie sua conta vinculada no MediaWiki para editar e contribuir com os
          conteúdos da plataforma.
        </p>
      </header>

      {user?.id ? (
        <section className={styles.colab_card}>
          <p className={styles.colab_card_text}>
            Conta conectada: <strong>{user.name ?? user.id}</strong>
          </p>
          {existingAccount?.mwUsername && (
            <p className={styles.colab_card_text}>
              Usuário na wiki: <strong>{existingAccount.mwUsername}</strong>
            </p>
          )}
          <CreateWikiAccountButton
            initialMwUsername={existingAccount?.mwUsername ?? null}
          />
        </section>
      ) : (
        <section className={styles.colab_card}>
          <p className={styles.colab_card_text}>
            Você precisa estar autenticado para gerar sua conta de colaborador.
          </p>
          <div className={styles.colab_actions_row}>
            <Link href="/login" className={styles.colab_secondary_link}>
              Entrar
            </Link>
            <Link href="/signup" className={styles.colab_secondary_link}>
              Criar conta
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
