import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("oryenza_theme");
    if (saved) return saved === "dark";
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("oryenza-dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("oryenza_theme", "dark");
    } else {
      document.documentElement.classList.remove("oryenza-dark");
      document.documentElement.setAttribute("data-theme", "light");
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
