'use client';

import { useState } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 border-2 border-white/80 dark:border-slate-800"
        aria-label="Open menu"
      >
        <Menu className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-4 w-64 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 rounded-2xl shadow-2xl p-0 overflow-hidden transition-transform duration-300 ease-out transform translate-x-0">
          <div className="px-6 py-4 border-b border-blue-50 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
            <span className="text-lg font-bold text-blue-700 dark:text-blue-200 tracking-wide">
              Options
            </span>
          </div>
          <div className="flex flex-col py-2">
            <ThemeToggle />
            <button className="flex items-center px-6 py-3 text-blue-800 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition w-full text-left gap-2 text-base font-medium focus:outline-none focus:bg-blue-100 dark:focus:bg-slate-700">
              <User className="h-5 w-5" /> Profile
            </button>
            <button className="flex items-center px-6 py-3 text-blue-800 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition w-full text-left gap-2 text-base font-medium focus:outline-none focus:bg-blue-100 dark:focus:bg-slate-700">
              <Settings className="h-5 w-5" /> Settings
            </button>
            <button className="flex items-center px-6 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-800 transition w-full text-left gap-2 text-base font-medium focus:outline-none focus:bg-red-100 dark:focus:bg-slate-700">
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

