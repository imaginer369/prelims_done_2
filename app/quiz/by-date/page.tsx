"use client";
import { useState } from "react";

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

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function QuizByDate() {
  const [date, setDate] = useState(getYesterday());
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Mix");
  const [topic, setTopic] = useState("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date,
      numQuestions: numQuestions.toString(),
      difficulty,
      topic,
    });
    window.location.href = `/quiz/by-date/quiz?${params.toString()}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10 px-2">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200 text-center drop-shadow-lg">
        Quiz by Article Date
      </h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-700 p-6 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Date</label>
          <input
            type="date"
            className="w-full rounded-md border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={date}
            onChange={e => setDate(e.target.value)}
            max={getYesterday()}
          />
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
