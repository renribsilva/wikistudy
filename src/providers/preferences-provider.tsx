"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { OptionalTheme } from "@/app/lib/themes/themes-config";

export interface ContextPreferences {
  theme?: OptionalTheme | null;
}

const PreferencesContext = createContext<{
  preferences: ContextPreferences | null;
}>({
  preferences: null,
});

export function PreferencesProvider({
  preferences,
  children,
}: {
  preferences: ContextPreferences | null;
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;
    setTheme(preferences?.theme ?? "system");
  }, [preferences?.theme, setTheme]);

  return (
    <PreferencesContext.Provider value={{ preferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
