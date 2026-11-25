import styles from "./dashboard.module.css";
import { getOptionalUser } from "@/app/lib/authorization/dal";
import { UserProvider } from "@/providers/user-provider";
import AppHeader from "@/components/tsx/header/header";
import AppSidebar from "@/components/tsx/sidebar/sidebar";
import { MobileSidebarBackdrop } from "@/components/tsx/sidebar/sidebar-backdrop";
import Footer from "@/components/tsx/footer";

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
        <main className={styles.layout_main}>
          {children}
          <Footer />
        </main>
      </div>
    </UserProvider>
  );
}
