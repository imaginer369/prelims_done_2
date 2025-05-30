"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <span className="text-sm font-medium text-gray-700">Theme:</span>
      <button
        className={`px-3 py-1 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "light" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-blue-100"}`}
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
      >
        Light
      </button>
      <button
        className={`px-3 py-1 rounded-full font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800 hover:bg-blue-100"}`}
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
      >
        Dark
      </button>
    </div>
  );
}
