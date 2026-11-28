"use client";

import styles from "./header.module.css";
import Link from "next/link";
import { useSidebar } from "@/providers/sidebar-provider";
import { useUser } from "@/providers/user-provider";
import DropdownProfile from "./dropdown-profile";
import Theme from "../buttons/theme-button";
import MenuButton from "../buttons/menu-button";

function AppHeader() {
  const { isMobile, isMobileOpen, toggleHeaderSidebar } = useSidebar();
  const { user } = useUser();
  const isAuthenticated = Boolean(user);

  return (
    <section className={styles.appheader_container}>
      {isMobile && (
        <div className={styles.appheader_menu_container}>
          <MenuButton />
        </div>
      )}
      <div className={styles.appheader_wikilogo_container}>
        <Link
          href="/"
          className={styles.appheader_wikilogo}
          onClick={isMobileOpen && toggleHeaderSidebar}
        >
          WikiStudy
        </Link>
      </div>
      <div className={styles.appheader_profile_container}>
        {!isMobile && <Theme />}
        <div className={styles.appheader_dropdown_wrap}>
          <DropdownProfile
            isAuthenticated={isAuthenticated}
            userName={user?.name}
            userEmail={user?.email}
            avatarFace={user?.avatarFace}
            userRole={user?.role}
          />
        </div>
      </div>
    </section>
  );
}

export default AppHeader;
