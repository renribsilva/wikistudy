"use client";

import styles from "./sidebar.module.css";
import { useSidebar } from "@/providers/sidebar-provider";
import LeftPanelClose from "@/components/svg/leftpanel-close";
import LeftPanelOpen from "@/components/svg/leftpanel-open";

function AppSidebar() {
  const { isMobileOpen, isMobile, isExpanded, toggleExpandSidebar } =
    useSidebar();

  if (isMobile && !isMobileOpen) {
    return null;
  }

  const isMobileDrawerOpen = Boolean(isMobile && isMobileOpen);
  const isSemi = !isMobileDrawerOpen && !isExpanded;

  const sidebarClass = [
    styles.appsidebar_container,
    isSemi ? styles.appsidebar_semi_expanded : "",
    isMobileDrawerOpen ? styles.appsidebar_mobile_open : "",
  ]
    .filter(Boolean)
    .join(" ");

  const topperClass = [
    styles.appsidebar_topper,
    isSemi ? styles.appsidebar_topper_semi : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={sidebarClass}>
      {!isMobile && (
        <div className={topperClass}>
          <button
            type="button"
            onClick={toggleExpandSidebar}
            aria-label={isExpanded ? "Recolher sidebar" : "Expandir sidebar"}
            title={isExpanded ? "Recolher sidebar" : "Expandir sidebar"}
            className={styles.appsidebar_toggle_btn}
          >
            {isExpanded ? <LeftPanelClose /> : <LeftPanelOpen />}
          </button>
        </div>
      )}
      <div className={styles.appsidebar_navbar}></div>
      <div className={styles.appsidebar_hr_box}></div>
    </aside>
  );
}

export default AppSidebar;
