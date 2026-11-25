"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import styles from "./buttons.module.css";
import Home from "@/components/svg/home";

interface HomeButtonProps {
  href?: string;
  width?: string;
  height?: string;
  ariaLabel?: string;
}

export function HomeButton({
  href = "/",
  width = "18px",
  height = "18px",
  ariaLabel = "Ir para a home",
}: HomeButtonProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <div
      className={styles.home_container}
      role="group"
      aria-label="Atalho para home"
    >
      <Link
        href={href}
        aria-label={ariaLabel}
        aria-current={isActive ? "page" : undefined}
        className={clsx(
          styles.home_button,
          isActive && styles.home_button_active,
        )}
      >
        <Home width={width} height={height} style={{ color: "inherit" }} />
      </Link>
    </div>
  );
}

export default HomeButton;
