"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// This script is injected into <head> to prevent flash of wrong theme.
// It runs synchronously before React hydrates.
const themeScript = `
(function() {
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();
`.trim();

export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateResolved = () => {
      const current = localStorage.getItem("theme") as Theme | null;
      const resolved =
        current === "light"
          ? "light"
          : current === "dark"
          ? "dark"
          : mediaQuery.matches
          ? "dark"
          : "light";
      setResolvedTheme(resolved);
    };

    updateResolved();
    mediaQuery.addEventListener("change", updateResolved);
    return () => mediaQuery.removeEventListener("change", updateResolved);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    const resolved =
      next === "light"
        ? "light"
        : next === "dark"
        ? "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    setResolvedTheme(resolved);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", resolved);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
