"use client";

import { useSidebar } from "@/providers/sidebar-provider";
import styles from "@/app/dashboard/dashboard.module.css";
import clsx from "clsx";

export function SidebarMain({ children }: { children: React.ReactNode }) {
  const { isMobile, isExpanded } = useSidebar();
  const isSemi = isMobile !== true && !isExpanded;

  return (
    <main
      className={clsx(styles.layout_main, isSemi && styles.layout_main_semi)}
    >
      {children}
    </main>
  );
}
