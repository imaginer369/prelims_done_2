"use client";
import { useEffect } from "react";

export default function ThemeClientEffect() {
  useEffect(() => {
    const appTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const root = document.documentElement;
    if (appTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'color-scheme');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', appTheme === 'dark' ? 'dark' : 'light');
  }, []);
  return null;
}
