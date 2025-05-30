// components/ArticleLoader.tsx
"use client";

export default function ArticleLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen m-0 p-0 bg-gradient-to-b from-blue-50 to-white">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Animated book icon with progress bar */}
        <div className="absolute w-20 h-20 animate-spin-slow will-change-transform">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <rect x="8" y="12" width="48" height="40" rx="6" fill="#2563eb" className="opacity-80"/>
            <rect x="12" y="16" width="40" height="32" rx="4" fill="#fff" className="opacity-90"/>
            <rect x="16" y="20" width="32" height="24" rx="2" fill="#e0e7ff"/>
            <rect x="20" y="24" width="24" height="16" rx="1" fill="#2563eb" className="opacity-60"/>
          </svg>
        </div>
        {/* Animated flipping page */}
        <div className="absolute w-20 h-20">
          <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
            <rect x="20" y="24" width="24" height="16" rx="1" fill="#fff">
              <animate attributeName="x" values="20;28;20" dur="1.2s" repeatCount="indefinite"/>
              <animate attributeName="width" values="24;8;24" dur="1.2s" repeatCount="indefinite"/>
            </rect>
          </svg>
        </div>
        {/* Circular progress bar overlay */}
        <svg className="absolute w-24 h-24" viewBox="0 0 48 48">
          <circle
            className="text-blue-200"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            cx="24"
            cy="24"
            r="20"
          />
          <circle
            className="text-blue-600 animate-progress-bar"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            cx="24"
            cy="24"
            r="20"
            strokeDasharray="125.6"
            strokeDashoffset="125.6"
          />
        </svg>
      </div>
      <div className="mt-8 text-lg font-semibold text-blue-700 tracking-wide animate-pulse text-center max-w-xs">
        Almost there...<br />Loading your articles
      </div>
      <div className="mt-4 text-xs text-gray-400 animate-fade-in">
        If this takes too long, check your internet connection.
      </div>
    </div>
  );
}

// Add this to your globals.css or tailwind config:
// .animate-spin-slow { animation: spin 2.5s linear infinite; }
// @keyframes spin { 100% { transform: rotate(360deg); } }
