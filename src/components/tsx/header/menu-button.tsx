"use client";

import { useSidebar } from "@/providers/sidebar-provider";
import styles from "./header.module.css";
import Menu from "@/components/svg/menu";

function MenuButton() {
  const { toggleMobileSidebar } = useSidebar();

  return (
    <button className={styles.menu_button} onClick={toggleMobileSidebar}>
      <Menu />
    </button>
  );
}

export default MenuButton;
