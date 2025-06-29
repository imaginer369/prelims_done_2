import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2">
        <Link href="/news" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <span className="material-icons">article</span>
          News
        </Link>
        <Link href="/quiz" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <span className="material-icons">quiz</span>
          Quiz
        </Link>
        <Link href="/articles-by-date" className="flex flex-col items-center text-xs text-yellow-600 dark:text-yellow-300 font-semibold">
          <span className="material-icons">calendar_today</span>
          By Date
        </Link>
        <Link href="/login" className="flex flex-col items-center text-xs text-gray-700 dark:text-gray-200 hover:text-blue-600">
          <span className="material-icons">person</span>
          Login
        </Link>
      </div>
    </nav>
  );
}
