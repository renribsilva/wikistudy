"use client";

import styles from "./components.module.css";
import Link from "next/link";
import Theme from "./theme-button";
import { useSidebar } from "@/context/sidebar-context";
import { useUser } from "@/context/user-context";
import MenuButton from "./menu-button";
import DropdownProfile from "./dropdown-profile";

function AppHeader() {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const isAuthenticated = Boolean(user);

  return (
    <section className={styles.appheader_container}>
      {isMobile && (
        <div className={styles.appheader_menu_container}>
          <MenuButton />
        </div>
      )}

      <Link href="/" className={styles.appheader_enemlogo}>
        <div>WikiStudy</div>
      </Link>

      <div className={styles.appheader_profile}>
        {!isMobile && (
          <div className="flex items-center">
            <Theme />
          </div>
        )}
        {isAuthenticated ? (
          <div>
            <DropdownProfile userName={user?.name} userEmail={user?.email} />
          </div>
        ) : (
          <div className={styles.appheader_profile_user}>
            <div>
              <Link href="/login" style={{ cursor: "pointer" }}>
                <button
                  type="button"
                  className={styles.appheader_profile_user_login}
                >
                  Entrar
                </button>
              </Link>
            </div>
            <div>
              <Link href="/signup" style={{ cursor: "pointer" }}>
                <button
                  type="button"
                  className={styles.appheader_profile_user_signup}
                >
                  Criar conta
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AppHeader;
