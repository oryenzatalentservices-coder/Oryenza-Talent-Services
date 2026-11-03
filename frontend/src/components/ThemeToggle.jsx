import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oryenza_theme_v2");
      if (saved) return saved === "dark";
      // First visit: always default to white (light) mode!
      return false;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("oryenza-dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("oryenza_theme_v2", "dark");
      localStorage.setItem("oryenza_theme", "dark");
    } else {
      document.documentElement.classList.remove("oryenza-dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("oryenza_theme_v2", "light");
      localStorage.setItem("oryenza_theme", "light");
    }
  }, [isDark]);

  return (
    <button
      id="oryenza-theme-toggle"
      type="button"
      onClick={() => setIsDark((prev) => !prev)}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Activate light mode" : "Activate dark mode"}
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
