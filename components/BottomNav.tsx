import Link from "next/link";

// Use Heroicons (recommended for Next.js/Tailwind) for better SSR compatibility
import { NewspaperIcon, AcademicCapIcon, CalendarDaysIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2">
        <button
          className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600 focus:outline-none"
          onClick={() => {
            if (window.location.pathname === "/") return;
            window.location.href = "/";
          }}
          type="button"
        >
          <NewspaperIcon className="h-6 w-6 mb-1" />
          News
        </button>
        <Link href="/quiz" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <AcademicCapIcon className="h-6 w-6 mb-1" />
          Quiz
        </Link>
        <Link href="/articles-by-date" className="flex flex-col items-center text-xs text-yellow-600 dark:text-yellow-300 font-semibold">
          <CalendarDaysIcon className="h-6 w-6 mb-1" />
          By Date
        </Link>
        <Link href="/login" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <UserCircleIcon className="h-6 w-6 mb-1" />
          Login
        </Link>
      </div>
    </nav>
  );
}
