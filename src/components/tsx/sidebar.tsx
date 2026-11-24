"use client";

import styles from "./components.module.css";
import { useSidebar } from "@/context/sidebar-context";

function AppSidebar() {
  const { isMobileOpen, isMobile } = useSidebar();

  const sidebarClass =
    isMobile && isMobileOpen
      ? `${styles.appsidebar_container} ${styles.appsidebar_mobile_open}`
      : styles.appsidebar_container;

  // const handleItemClick = () => {
  //   if (isMobile && isMobileOpen) {
  //     toggleMobileSidebar();
  //   }
  // };

  return (
    <div className={sidebarClass}>
      <div className={styles.appsidebar_topper}>
        <div className={styles.appsidebar_dropdown}></div>
        <div className={styles.appsidebar_navbar}></div>
        <div className={styles.appsidebar_hr_box}></div>
        {/* <div className={styles.appsidebar_footer}> */}
        {/*   <Footer /> */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default AppSidebar;
