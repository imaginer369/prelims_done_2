"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NewspaperIcon, AcademicCapIcon, CalendarDaysIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function BottomNav() {
  const pathname = usePathname() || "";
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2">
        <button
          className={`flex flex-col items-center text-xs focus:outline-none ${pathname === "/" || pathname === "/news" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-blue-600"}`}
          onClick={() => {
            if (pathname === "/" || pathname === "/news") return;
            window.location.href = "/news";
          }}
          type="button"
        >
          <NewspaperIcon className="h-6 w-6 mb-1" />
          News
        </button>
        <Link href="/quiz" className={`flex flex-col items-center text-xs ${pathname.startsWith("/quiz") ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-blue-600"}`}>
          <AcademicCapIcon className="h-6 w-6 mb-1" />
          Quiz
        </Link>
        <Link href="/article-nav" className={`flex flex-col items-center text-xs ${pathname === "/article-nav" ? "text-yellow-600 dark:text-yellow-300 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-yellow-600"}`}>
          <CalendarDaysIcon className="h-6 w-6 mb-1" />
          Article Nav
        </Link>
        <Link href="/login" className={`flex flex-col items-center text-xs ${pathname === "/login" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-blue-600"}`}>
          <UserCircleIcon className="h-6 w-6 mb-1" />
          Login
        </Link>
      </div>
    </nav>
  );
}
