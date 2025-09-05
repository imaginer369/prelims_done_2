"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'color-scheme');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  return (
    <div className="flex flex-col gap-2 w-full px-4 py-3">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-1">Theme</span>
      <div className="flex items-center w-full justify-center">
        <button
          className={`relative w-14 h-8 flex items-center bg-gray-200 dark:bg-slate-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-300 dark:border-slate-600`}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-pressed={theme === "dark"}
        >
          <span
            className={`absolute left-1 top-1 w-6 h-6 rounded-full shadow-md transition-transform duration-300 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 flex items-center justify-center
              ${theme === "dark" ? "translate-x-6" : "translate-x-0"}`}
          >
            {theme === "dark" ? (
              <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            ) : (
              <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
            )}
          </span>
          <span className="sr-only">Toggle dark mode</span>
        </button>
        <span className="ml-4 text-sm font-medium text-gray-700 dark:text-gray-200">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      </div>
    </div>
  );
}
