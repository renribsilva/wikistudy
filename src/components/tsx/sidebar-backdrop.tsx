"use client";

import { useSidebar } from "@/context/sidebar-context";
import clsx from "clsx";
import { useRef } from "react";
import styles from "./components.module.css";

export function MobileSidebarBackdrop() {
  const { isMobile, isMobileOpen, toggleMobileSidebar } = useSidebar();

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
      toggleMobileSidebar();
    }
  };

  return (
    <div
      className={clsx(styles.backdrop, isMobileOpen && styles.backdrop_active)}
      onClick={toggleMobileSidebar}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
}
