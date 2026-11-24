import styles from "./layout.module.css";
import { getOptionalUser } from "@/app/lib/authorization/dal";
import { UserProvider } from "@/context/user-context";
import AppHeader from "@/components/tsx/header";
import AppSidebar from "@/components/tsx/sidebar";
import { MobileSidebarBackdrop } from "@/components/tsx/sidebar-backdrop";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalUser();

  return (
    <UserProvider user={user}>
      <div className={styles.layout_container}>
        <MobileSidebarBackdrop />
        <aside className={styles.layout_sidebar}>
          <AppSidebar />
        </aside>
        <header className={styles.layout_header}>
          <AppHeader />
        </header>
        <main className={styles.layout_main}>{children}</main>
      </div>
    </UserProvider>
  );
}
