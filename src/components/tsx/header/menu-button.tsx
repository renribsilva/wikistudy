"use client";

import { useSidebar } from "@/providers/sidebar-provider";
import styles from "./header.module.css";
import Menu from "@/components/svg/menu";

function MenuButton() {
  const { toggleHeaderSidebar } = useSidebar();

  return (
    <button className={styles.menu_button} onClick={toggleHeaderSidebar}>
      <Menu />
    </button>
  );
}

export default MenuButton;
