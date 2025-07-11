"use client";
import { useState } from "react";

const timeframes = [
  { label: "Last 1 week", value: "1w" },
  { label: "Last 2 weeks", value: "2w" },
  { label: "Last 1 month", value: "1m" },
  { label: "Last 2 months", value: "2m" },
  { label: "Last 4 months", value: "4m" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last 9 months", value: "9m" },
  { label: "Last 1 year", value: "1y" },
  { label: "Last 2 years", value: "2y" },
];

const topics = [
  "All",
  "Current Events of National and International Importance",
  "History of India and Indian National Movement",
  "Indian and World Geography - Physical, Social, Economic Geography of India and the World",
  "Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.",
  "Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.",
  "General Issues on Environmental Ecology, Bio-diversity and Climate Change - that do not require subject specialization",
  "General Science"
];

const difficulties = ["Mix", "Easy", "Medium", "Hard", "Super Hard"];

export default function QuizByTimeframe() {
  const [timeframe, setTimeframe] = useState("1w");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Mix");
  const [topic, setTopic] = useState("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      timeframe,
      numQuestions: numQuestions.toString(),
      difficulty,
      topic,
    });
    window.location.href = `/quiz/by-timeframe/quiz?${params.toString()}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-2">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200 text-center drop-shadow-lg">
        Quiz by Timeframe
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-700 p-6 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Timeframe</label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={timeframe}
            onChange={e => setTimeframe(e.target.value)}
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
        </div>
        <div>
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
