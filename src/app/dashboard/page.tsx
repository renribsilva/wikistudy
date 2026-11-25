import { getOptionalUser } from "@/app/lib/authorization/dal";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const user = await getOptionalUser();

  return (
    <section className={styles.dash_section}>
      <div>
        <h1>WikiStudy</h1>
        <p>
          {user
            ? `Bem-vindo de volta, ${user.name}!`
            : "Explore o WikiStudy como visitante ou entre para personalizar sua experiência."}
        </p>
      </div>
    </section>
  );
}
