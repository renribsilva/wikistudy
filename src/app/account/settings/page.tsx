import type { Metadata } from "next";
import { getUser } from "@/app/lib/authorization/dal";
import { deleteAccount } from "@/app/lib/settings/delete-account";
import { updateAvatarFace } from "@/app/lib/settings/update-avatar";
import { updateUserName } from "@/app/lib/settings/update-name";
import styles from "./settings.module.css";
import { FaceSelectorCard } from "@/components/tsx/settings/face-selector";
import { NameFormCard } from "@/components/tsx/settings/name-form-card";
import { DeleteAccountCard } from "@/components/tsx/settings/delete-account";

export const metadata: Metadata = {
  title: "Configurações da conta | WikiStudy",
  description:
    "Gerencie a aparência do seu avatar e preferências da conta no WikiStudy.",
};

const DEFAULT_AVATAR_FACE = 1 as const;

export default async function AccountSettingsPage() {
  const user = await getUser();
  const initialFace = user?.avatarFace ?? DEFAULT_AVATAR_FACE;

  return (
    <main className={styles.container} aria-labelledby="account-settings-title">
      <header className={styles.header}>
        <div>
          <h1 id="account-settings-title" className={styles.title}>
            Configurações da conta
          </h1>
          <p className={styles.subtitle}>
            Gerencie as preferências visuais da sua conta.
          </p>
        </div>
      </header>
      <section className={styles.section} aria-label="Personalização do perfil">
        <NameFormCard initialName={user?.name} onSave={updateUserName} />
        <FaceSelectorCard
          initialFace={initialFace}
          defaultFace={DEFAULT_AVATAR_FACE}
          onSave={updateAvatarFace}
        />
        <DeleteAccountCard onDelete={deleteAccount} />
      </section>
    </main>
  );
}
