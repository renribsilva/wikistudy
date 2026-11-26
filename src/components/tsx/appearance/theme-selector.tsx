"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import styles from "./appearance.module.css";
import {
  OPTIONAL_THEMES,
  OptionalTheme,
  THEME_CONFIG,
} from "@/app/lib/themes/themes-config";

interface SaveThemeResult {
  ok: boolean;
  error?: string;
  theme?: OptionalTheme | null;
}

interface ThemeSelectorCardProps {
  initialTheme: OptionalTheme | null;
  onSave: (theme: OptionalTheme | null) => Promise<SaveThemeResult>;
}

export function ThemeSelectorCard({
  initialTheme,
  onSave,
}: ThemeSelectorCardProps) {
  const { setTheme } = useTheme();
  const [confirmedTheme, setConfirmedTheme] = useState<OptionalTheme | null>(
    initialTheme,
  );
  const [savingTheme, setSavingTheme] = useState<OptionalTheme | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [computedByTheme, setComputedByTheme] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const nextMap: Record<string, string[]> = {};

    for (const themeKey of OPTIONAL_THEMES) {
      const cfg = THEME_CONFIG[themeKey];
      if (!cfg) continue;

      nextMap[themeKey] = cfg.colors.map(({ variable }) =>
        rootStyles.getPropertyValue(variable).trim(),
      );
    }

    setComputedByTheme(nextMap);
  }, [confirmedTheme]);

  useEffect(() => {
    if (!savingTheme) {
      setConfirmedTheme(initialTheme);
    }
  }, [initialTheme, savingTheme]);

  function applyTheme(themeValue: OptionalTheme | null) {
    if (typeof document !== "undefined") {
      OPTIONAL_THEMES.forEach((themeName) => {
        document.documentElement.classList.remove(themeName);
      });
      document.documentElement.removeAttribute("data-theme");
    }

    if (themeValue) {
      setTheme(themeValue);
      return;
    }

    setTheme("system");
  }

  async function handleToggle(item: OptionalTheme) {
    if (savingTheme) return;

    const targetTheme: OptionalTheme | null =
      confirmedTheme === item ? null : item;

    setSavingTheme(item);
    setMessage(null);
    setError(null);

    try {
      const res = await onSave(targetTheme);

      if (!res.ok) {
        applyTheme(confirmedTheme);
        setError(res.error ?? "Não foi possível atualizar o tema.");
        return;
      }

      const finalTheme = res.theme !== undefined ? res.theme : targetTheme;
      setConfirmedTheme(finalTheme);
      applyTheme(finalTheme);
      setMessage(
        finalTheme
          ? `${THEME_CONFIG[finalTheme].label} ativado.`
          : "Tema do sistema aplicado.",
      );
    } catch {
      applyTheme(confirmedTheme);
      setError("Falha ao atualizar o tema.");
    } finally {
      setSavingTheme(null);
    }
  }

  return (
    <div
      className={styles.theme_selector_list}
      role="group"
      aria-label="Temas opcionais"
    >
      {OPTIONAL_THEMES.map((item) => {
        const config = THEME_CONFIG[item];
        if (!config) return null;

        const isActive = confirmedTheme === item;
        const isThisSaving = savingTheme === item;
        const colors = computedByTheme[item] ?? [];

        return (
          <div key={item} className={styles.theme_selector_card}>
            <div className={styles.theme_selector_top}>
              <div className={styles.theme_selector_info}>
                <h2 className={styles.theme_selector_title}>
                  {config.label}
                  {isActive ? " (ativo)" : ""}
                </h2>
                <p className={styles.theme_selector_subtitle}>
                  {config.description}
                </p>
              </div>

              <div className={styles.theme_selector_actions}>
                <button
                  type="button"
                  disabled={Boolean(savingTheme)}
                  aria-pressed={isActive}
                  onClick={() => handleToggle(item)}
                  className={`${styles.theme_selector_button} ${
                    isActive ? styles.theme_selector_button_active : ""
                  }`}
                >
                  {isThisSaving ? (
                    <>
                      <span
                        className={styles.theme_selector_spinner}
                        aria-hidden="true"
                      />
                      <span>Aguarde...</span>
                    </>
                  ) : (
                    <span>{isActive ? "Desativar" : "Ativar"}</span>
                  )}
                </button>
              </div>
            </div>
            <div
              className={styles.theme_selector_swatches}
              aria-label={`Paleta ${config.label}`}
            >
              {config.colors.map(
                (swatch: { name: string; variable: string }, index: number) => {
                  const hex = colors[index] || swatch.variable;

                  return (
                    <div
                      key={swatch.variable}
                      className={styles.theme_selector_swatch}
                      title={`${swatch.name}: ${hex}`}
                    >
                      <span
                        className={styles.theme_selector_swatch_square}
                        style={{ backgroundColor: `var(${swatch.variable})` }}
                      />
                      <span className={styles.theme_selector_swatch_meta}>
                        <span className={styles.theme_selector_swatch_name}>
                          {swatch.name}
                        </span>
                        <span className={styles.theme_selector_swatch_code}>
                          {hex}
                        </span>
                      </span>
                    </div>
                  );
                },
              )}{" "}
            </div>
          </div>
        );
      })}

      {savingTheme && (
        <p className={styles.theme_selector_status} role="status">
          Aplicando tema...
        </p>
      )}
      {!savingTheme && message && (
        <p className={styles.theme_selector_status} role="status">
          {message}
        </p>
      )}
      {!savingTheme && error && (
        <p className={styles.theme_selector_error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
