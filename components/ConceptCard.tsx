"use client";
import { useState, Suspense, lazy } from "react";
import remarkGfm from "remark-gfm";

const LazyReactMarkdown = lazy(() => import("react-markdown"));

interface Concept {
  id: number;
  name: string;
  info: string;
}

interface ConceptCardProps {
  concept: Concept;
  open?: boolean;
  onToggle?: () => void;
}

export default function ConceptCard({ concept, open, onToggle }: ConceptCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  // Use controlled open if provided, else fallback to local state
  const isOpen = typeof open === 'boolean' ? open : showInfo;
  const handleToggle = onToggle ? onToggle : () => setShowInfo((prev) => !prev);
  return (
    <div className="relative flex flex-col bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 group focus-within:ring-2 focus-within:ring-blue-400 min-h-[120px] text-black dark:text-white w-full max-w-full sm:max-w-none">
      <button
        onClick={handleToggle}
        className={`w-full flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-800 dark:to-blue-900 text-white font-semibold rounded-t-2xl shadow-lg transition duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${isOpen ? '' : 'rounded-b-2xl'}`}
        aria-expanded={isOpen}
        aria-controls={`concept-info-${concept.id}`}
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
        </span>
        <span className="truncate text-lg font-medium flex-1 text-left">{concept.name}</span>
        <svg className={`ml-2 w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <div
        id={`concept-info-${concept.id}`}
        className={`w-full overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'} rounded-b-2xl`}
        aria-hidden={!isOpen}
      >
        <div className="prose prose-blue p-4 max-h-[320px] overflow-y-auto animate-fade-in bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700 shadow-lg rounded-b-2xl text-black dark:text-white">
          <Suspense fallback={<div>Loading markdown...</div>}>
            <LazyReactMarkdown remarkPlugins={[remarkGfm]}>{concept.info}</LazyReactMarkdown>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
