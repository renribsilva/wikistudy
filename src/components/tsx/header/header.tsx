"use client";

import styles from "./header.module.css";
import Link from "next/link";
import { useSidebar } from "@/providers/sidebar-provider";
import { useUser } from "@/providers/user-provider";
import MenuButton from "./menu-button";
import DropdownProfile from "./dropdown-profile";
import Theme from "../buttons/theme-button";

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

      <Link href="/" className={styles.appheader_wikilogo}>
        <div>WikiStudy</div>
      </Link>

      <div className={styles.appheader_profile}>
        {!isMobile && (
          <div>
            <Theme />
          </div>
        )}
        <div className={styles.appheader_dropdown_wrap}>
          <DropdownProfile
            isAuthenticated={isAuthenticated}
            userName={user?.name}
            userEmail={user?.email}
            avatarFace={user?.avatarFace}
          />
        </div>
      </div>
    </section>
  );
}

export default AppHeader;
