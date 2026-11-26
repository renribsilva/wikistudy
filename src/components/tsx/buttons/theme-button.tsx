"use client";

import { useTheme } from "next-themes";
import styles from "./buttons.module.css";
import { useEffect, useState } from "react";
import clsx from "clsx";
import System from "@/components/svg/system";
import Light from "@/components/svg/light";
import Dark from "@/components/svg/dark";

interface ThemeProps {
  width?: string;
  height?: string;
  compact?: boolean;
}

function Theme({
  width = "20px",
  height = "20px",
  compact = false,
}: ThemeProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme ?? "system";
  const iconSize = compact ? "20px" : width;
  const iconHeight = compact ? "20px" : height;

  return (
    <div
      className={clsx(
        styles.theme_container,
        compact && styles.theme_container_compact,
      )}
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
          compact && styles.theme_button_compact,
          currentTheme === "system" && styles.theme_button_active,
        )}
      >
        <System
          width={iconSize}
          height={iconHeight}
          style={{ color: "inherit" }}
        />
      </button>

      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-label="Ativar tema claro"
        aria-pressed={currentTheme === "light"}
        className={clsx(
          styles.theme_button,
          compact && styles.theme_button_compact,
          currentTheme === "light" && styles.theme_button_active,
        )}
      >
        <Light
          width={iconSize}
          height={iconHeight}
          style={{ color: "inherit" }}
        />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-label="Ativar tema escuro"
        aria-pressed={currentTheme === "dark"}
        className={clsx(
          styles.theme_button,
          compact && styles.theme_button_compact,
          currentTheme === "dark" && styles.theme_button_active,
        )}
      >
        <Dark
          width={iconSize}
          height={iconHeight}
          style={{ color: "inherit" }}
        />
      </button>
    </div>
  );
}

export default Theme;
