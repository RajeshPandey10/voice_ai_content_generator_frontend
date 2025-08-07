import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const stored = localStorage.getItem("theme");
    if (stored && ["light", "dark"].includes(stored)) {
      return stored;
    }

    // Default to light theme
    return "light";
  });

  // Apply theme immediately on initialization
  useEffect(() => {
    const applyTheme = () => {
      localStorage.setItem("theme", theme);

      // Remove both classes first
      document.documentElement.classList.remove("light", "dark");

      // Add the current theme class
      document.documentElement.classList.add(theme);

      // Set a data attribute as well for better CSS targeting
      document.documentElement.setAttribute("data-theme", theme);
    };

    applyTheme();
  }, [theme]);

  // Apply theme immediately when component mounts (before first render)
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setSpecificTheme = (newTheme) => {
    if (["light", "dark"].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        effectiveTheme: theme,
        setTheme: setSpecificTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
