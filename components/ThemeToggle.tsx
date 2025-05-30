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
      <div className="flex gap-2 w-full">
        <button
          className={`flex-1 px-4 py-2 rounded-lg font-semibold border text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm
            ${theme === "light"
              ? "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
              : "bg-slate-800 text-gray-200 border-slate-700 hover:bg-slate-700"}
          `}
          onClick={() => setTheme("light")}
          aria-pressed={theme === "light"}
        >
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
            Light
          </span>
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-lg font-semibold border text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm
            ${theme === "dark"
              ? "bg-slate-900 text-white border-slate-700 hover:bg-slate-800"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}
          `}
          onClick={() => setTheme("dark")}
          aria-pressed={theme === "dark"}
        >
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            Dark
          </span>
        </button>
      </div>
    </div>
  );
}
