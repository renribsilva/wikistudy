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
  const { theme, setTheme } = useTheme();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    const serverTheme = preferences?.theme;
    if (!serverTheme) return;

    initialized.current = true;
    if (theme !== serverTheme) {
      setTheme(serverTheme);
    }
  }, [preferences?.theme, theme, setTheme]);

  return (
    <PreferencesContext.Provider value={{ preferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
