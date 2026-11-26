"use client";

import { useSidebar } from "@/providers/sidebar-provider";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./sidebar.module.css";

export function MobileSidebarBackdrop() {
  const { isMobile, isMobileOpen, toggleHeaderSidebar } = useSidebar();

  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  if (!isMobile) return null;

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
      toggleHeaderSidebar();
    }
  };

  return (
    <div
      className={clsx(styles.backdrop, isMobileOpen && styles.backdrop_active)}
      onClick={toggleHeaderSidebar}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
}
