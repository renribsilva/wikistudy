import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { updateUserTheme } from "@/app/lib/settings/update-theme";
import { ThemeSelectorCard } from "@/components/tsx/appearance/theme-selector";
import styles from "./appearance.module.css";
import { getUser, getUserPreferences } from "@/app/lib/authorization/dal";

export const metadata: Metadata = {
  title: "Aparência | WikiStudy",
  description: "Gerencie o tema opcional da sua conta no WikiStudy.",
};

export default async function AccountAppearancePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const preferences = await getUserPreferences();
  const initialTheme = preferences?.theme ?? null;

  return (
    <main
      className={styles.appearance_container}
      aria-labelledby="account-appearance-title"
    >
      <header className={styles.appearance_header}>
        <div className={styles.appearance_ascoisas}>
          <h1 id="account-appearance-title" className={styles.appearance_title}>
            Aparência
          </h1>
          <p className={styles.appearance_subtitle}>
            Gerencie o tema opcional da sua conta. Os modos padrão (sistema,
            claro e escuro) continuam no seletor global.
          </p>
        </div>
      </header>
      <div className={styles.appearance_ascoisas}>
        <ThemeSelectorCard
          initialTheme={initialTheme}
          onSave={updateUserTheme}
        />
      </div>
    </main>
  );
}
