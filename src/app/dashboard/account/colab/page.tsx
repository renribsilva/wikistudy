import { eq } from "drizzle-orm";
import { getUser } from "@/app/lib/authorization/dal";
import { db } from "@/app/lib/database/db";
import { mediawikiAccounts } from "@/app/lib/database/schema";
import { CreateWikiAccountButton } from "@/components/tsx/buttons/colab-button";
import { DisconnectWikiAccountButton } from "@/components/tsx/buttons/unlink-wiki-button";
import styles from "./colab.module.css";

const MEDIAWIKI_URL = "https://mediawikistudy.onrender.com/";

export default async function ColabPage() {
  const user = await getUser();

  const existingAccount = await db.query.mediawikiAccounts.findFirst({
    where: eq(mediawikiAccounts.userId, user.id),
    columns: { mwUsername: true },
  });

  const mwUsername = existingAccount?.mwUsername?.trim() ?? null;
  const isColabActive = user.role === "colab";
  const hasStoredAccount = Boolean(mwUsername);

  return (
    <main className={styles.colab_wrapper}>
      <header className={styles.colab_header}>
        <h1 className={styles.colab_title}>Ser um colaborador na WikiStudy</h1>
        <p className={styles.colab_subtitle}>
          Sua conta WikiStudy gerencia seu acesso e perfil; a conta MediaWiki
          vinculada é usada para criar e editar artigos na wiki.
        </p>
      </header>

      <section className={styles.colab_card}>
        <div className={styles.colab_info_group}>
          <div className={styles.colab_info_item}>
            <span className={styles.colab_info_label}>Conta WikiStudy</span>
            <p className={styles.colab_card_text}>
              <strong>{user.name ?? user.id}</strong> — conta principal da
              plataforma.
            </p>
          </div>

          <hr className={styles.colab_divider} />

          <div className={styles.colab_info_item}>
            <span className={styles.colab_info_label}>
              Conta MediaWiki vinculada
            </span>
            <p className={styles.colab_card_text}>
              {isColabActive
                ? mwUsername
                  ? `Vinculada (${mwUsername}) à sua conta WikiStudy para editar conteúdos.`
                  : "Acesso de colaborador ativo na WikiStudy."
                : hasStoredAccount && mwUsername
                  ? `Acesso de colaborador desativado. Conta MediaWiki (${mwUsername}) salva — reative abaixo para voltar a editar.`
                  : "Ainda não vinculada. Crie abaixo para habilitar a edição na wiki."}
            </p>
            <a
              href={MEDIAWIKI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.colab_wiki_link}
            >
              Acessar MediaWiki (mediawikistudy.onrender.com)
            </a>
          </div>
        </div>

        <div className={styles.colab_actions}>
          <CreateWikiAccountButton
            initialMwUsername={isColabActive ? mwUsername : null}
            storedMwUsername={!isColabActive ? mwUsername : null}
            canReactivate={!isColabActive && hasStoredAccount}
          />

          {isColabActive && (
            <DisconnectWikiAccountButton
              mwUsername={mwUsername ?? user.name ?? user.id}
            />
          )}
        </div>
      </section>
    </main>
  );
}
