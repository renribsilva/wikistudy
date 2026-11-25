"use client";

import type { CSSProperties, ComponentPropsWithoutRef } from "react";
import styles from "./buttons.module.css";
import Google from "@/components/svg/google";

interface GoogleSignInButtonProps extends Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "children" | "style"
> {
  href?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export function GoogleSignInButton({
  href = "/api/auth/google",
  label = "Continuar com Google",
  className = "",
  style,
  ...props
}: GoogleSignInButtonProps) {
  const buttonClass = [styles["gsi-material-button"], className]
    .filter(Boolean)
    .join(" ");

  return (
    <a href={href} className={buttonClass} style={style} {...props}>
      <div className={styles["gsi-material-button-state"]} />
      <div className={styles["gsi-material-button-content-wrapper"]}>
        <div className={styles["gsi-material-button-icon"]}>
          <Google aria-hidden="true" />
        </div>
        <span className={styles["gsi-material-button-contents"]}>{label}</span>
        <span className={styles["gsi-material-button-sr-label"]}>{label}</span>
      </div>
    </a>
  );
}

export default GoogleSignInButton;
