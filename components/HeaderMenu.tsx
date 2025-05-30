'use client';

import { useState } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 border-2 border-white/80 dark:border-slate-800"
        aria-label="Open menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {/* Sidebar menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 dark:bg-black/60 transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu overlay"
          />
          {/* Sidebar */}
          <aside className="relative w-80 max-w-full h-full bg-white dark:bg-slate-900 border-r border-blue-100 dark:border-slate-700 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out animate-slide-in-left">
            <div className="flex items-center gap-2 px-6 py-5 border-b border-blue-50 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
              <Menu className="w-5 h-5 text-blue-700 dark:text-blue-200" />
              <span className="text-lg font-semibold text-blue-700 dark:text-blue-200 tracking-wide">
                Options
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-auto p-2 rounded-full hover:bg-blue-100 dark:hover:bg-slate-800 transition"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5 text-blue-700 dark:text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-col py-4 divide-y divide-blue-50 dark:divide-slate-800 flex-1 overflow-y-auto">
              <div className="px-6 pb-4">
                <ThemeToggle />
              </div>
              <button className="flex items-center gap-3 px-6 py-4 text-blue-800 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition w-full text-left text-base font-medium focus:outline-none focus:bg-blue-100 dark:focus:bg-slate-700">
                <User className="h-5 w-5 opacity-80" /> Profile
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-blue-800 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition w-full text-left text-base font-medium focus:outline-none focus:bg-blue-100 dark:focus:bg-slate-700">
                <Settings className="h-5 w-5 opacity-80" /> Settings
              </button>
              <button className="flex items-center gap-3 px-6 py-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition w-full text-left text-base font-medium focus:outline-none focus:bg-red-100 dark:focus:bg-slate-700">
                <LogOut className="h-5 w-5 opacity-80" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

