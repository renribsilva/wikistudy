"use client";

import { useRef } from "react";
import styles from "./layout.module.css";
import clsx from "clsx";
import { useSidebar } from "@/context/sidebar-context";

function HomeLayout({ children }: { children: React.ReactNode }) {
  const { isMobileOpen, toggleMobileSidebar, isMobile } = useSidebar();

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;

    if (swipeDistance > minSwipeDistance) {
      toggleMobileSidebar();
    }
  };

  return (
    <div className={styles.layout_container}>
      {isMobile && (
        <div
          className={clsx(
            styles.backdrop,
            isMobileOpen && styles.backdrop_active,
          )}
          onClick={toggleMobileSidebar}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      )}
      <div className={styles.layout_sidebar}></div>
      <header className={styles.layout_header}></header>
      <main className={styles.layout_main}>{children}</main>
    </div>
  );
}

export default HomeLayout;
