import { createContext, useContext, useEffect } from "react";
import { useStore } from "@/store/useStore";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProviderContext = createContext({});

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
