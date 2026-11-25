"use client";

import { useTheme } from "next-themes";
import styles from "./components.module.css";
import Light from "../svg/light";
import Dark from "../svg/dark";
import System from "../svg/system";
import { useEffect, useState } from "react";
import clsx from "clsx";

interface ThemeProps {
  width?: string;
  height?: string;
}

function Theme({ width = "18px", height = "18px" }: ThemeProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme ?? "system";

  return (
    <div
      className={styles.theme_container}
      role="group"
      aria-label="Seletor de tema"
    >
      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-label="Ativar tema do sistema"
        aria-pressed={currentTheme === "system"}
        className={clsx(
          styles.theme_button,
          currentTheme === "system" && styles.theme_button_active,
        )}
      >
        <System width={width} height={height} style={{ color: "inherit" }} />
      </button>

      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Ativar tema claro"
        aria-pressed={currentTheme === "light"}
        className={clsx(
          styles.theme_button,
          currentTheme === "light" && styles.theme_button_active,
        )}
      >
        <Light width={width} height={height} style={{ color: "inherit" }} />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Ativar tema escuro"
        aria-pressed={currentTheme === "dark"}
        className={clsx(
          styles.theme_button,
          currentTheme === "dark" && styles.theme_button_active,
        )}
      >
        <Dark width={width} height={height} style={{ color: "inherit" }} />
      </button>
    </div>
  );
}

export default Theme;
