"use client";

import styles from "./sidebar.module.css";
import { useSidebar } from "@/providers/sidebar-provider";

function AppSidebar() {
  const { isMobileOpen, isMobile } = useSidebar();

  const sidebarClass =
    isMobile && isMobileOpen
      ? `${styles.appsidebar_container} ${styles.appsidebar_mobile_open}`
      : styles.appsidebar_container;

  return (
    <div className={sidebarClass}>
      <div className={styles.appsidebar_topper}>
        <div className={styles.appsidebar_dropdown}></div>
        <div className={styles.appsidebar_navbar}></div>
        <div className={styles.appsidebar_hr_box}></div>
      </div>
    </div>
  );
}

export default AppSidebar;
