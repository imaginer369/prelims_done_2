// app/quiz/page.tsx

import Link from "next/link";

const quizOptions = [
  {
    label: "Quiz by Article Dates",
    href: "/quiz/by-date",
    icon: (
      <svg className="w-7 h-7 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
    ),
  },
  {
    label: "Quiz by Timeframe",
    href: "/quiz/by-timeframe",
    icon: (
      <svg className="w-7 h-7 text-yellow-500 dark:text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
    ),
  },
  {
    label: "Mock Test",
    href: "/quiz/mock-test",
    icon: (
      <svg className="w-7 h-7 text-purple-500 dark:text-purple-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 2v4M16 2v4M4 10h16"/></svg>
    ),
  },
];

export default function QuizHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-2">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-blue-700 dark:text-blue-200 text-center drop-shadow-lg">
        Quiz Center
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {quizOptions.map((opt) => (
          <Link
            key={opt.label}
            href={opt.href}
            className="group flex flex-col items-center justify-center rounded-2xl border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-200 p-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[140px] text-center"
          >
            <span className="mb-3">{opt.icon}</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-300">
              {opt.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

