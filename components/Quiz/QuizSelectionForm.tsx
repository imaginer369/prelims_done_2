import React from "react";

interface QuizSelectionFormProps {
  title: string;
  showDate?: boolean;
  showTimeframe?: boolean;
  date?: string;
  setDate?: (date: string) => void;
  timeframe?: string;
  setTimeframe?: (tf: string) => void;
  numQuestions: number;
  setNumQuestions: (n: number) => void;
  difficulty: string;
  setDifficulty: (d: string) => void;
  topic: string;
  setTopic: (t: string) => void;
  topics: string[];
  difficulties: string[];
  onSubmit: (e: React.FormEvent) => void;
  getYesterday?: () => string;
  timeLimit: number;
  setTimeLimit: (n: number) => void;
}

export default function QuizSelectionForm({
  title,
  showDate = false,
  showTimeframe = false,
  date = "",
  setDate,
  timeframe = "",
  setTimeframe,
  numQuestions,
  setNumQuestions,
  difficulty,
  setDifficulty,
  topic,
  setTopic,
  topics,
  difficulties,
  onSubmit,
  getYesterday,
  timeLimit,
  setTimeLimit
}: QuizSelectionFormProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-2">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200 text-center drop-shadow-lg">
        {title}
      </h1>
      <form onSubmit={onSubmit} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-700 p-6 flex flex-col gap-6">
        {showDate && setDate && (
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Date</label>
            <input
              type="date"
              className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={date}
              onChange={e => setDate(e.target.value)}
              max={getYesterday ? getYesterday() : undefined}
            />
          </div>
        )}
        {showTimeframe && setTimeframe && (
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Timeframe</label>
            <select
              className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
            >
              <option value="">Select timeframe</option>
              <option value="last-7-days">Last 7 days</option>
              <option value="last-30-days">Last 30 days</option>
              <option value="last-90-days">Last 90 days</option>
              <option value="last-365-days">Last 1 year</option>
              <option value="last-3-years">Last 3 years</option>
            </select>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Number of Questions</label>
            <input
              type="number"
              min={1}
              max={100}
              className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Time Limit</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={10}
                max={7200}
                step={1}
                className="w-24 rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right font-mono text-lg"
                value={Math.floor(timeLimit / 60)}
                onChange={e => setTimeLimit(Math.max(10, Number(e.target.value) * 60 + (timeLimit % 60)))}
                aria-label="Minutes"
              />
              <span className="text-gray-500 dark:text-gray-300">min</span>
              <input
                type="number"
                min={0}
                max={59}
                step={1}
                className="w-20 rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right font-mono text-lg"
                value={timeLimit % 60}
                onChange={e => setTimeLimit(Math.max(10, (Math.floor(timeLimit / 60) * 60) + Number(e.target.value)))}
                aria-label="Seconds"
              />
              <span className="text-gray-500 dark:text-gray-300">sec</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Minimum 10 seconds. Default: 10 minutes.</div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Difficulty</label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            {difficulties.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Topic</label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          >
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full mt-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Start Quiz
        </button>
      </form>
    </div>
  );
}
