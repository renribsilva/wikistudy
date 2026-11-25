"use client";

import { useRouter } from "next/navigation";
import styles from "./buttons.module.css";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
}

export function BackButton({
  fallbackHref = "/dashboard",
  label = "Voltar",
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={
        className ? `${styles.back_button} ${className}` : styles.back_button
      }
    >
      <span className={styles.back_button_icon} aria-hidden="true">
        ←
      </span>
      <span>{label}</span>
    </button>
  );
}
