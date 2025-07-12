"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import styles from "./article-nav.module.css"; // CSS file removed

const timeframes = [
  { label: "2 days", value: "2d" },
  { label: "3 days", value: "3d" },
  { label: "5 days", value: "5d" },
  { label: "1 week", value: "1w" },
  { label: "2 weeks", value: "2w" },
  { label: "1 month", value: "1m" },
];

// Category options removed (no category column yet)


export default function ArticleNavPage() {
  const [date, setDate] = useState("");
  const [timeframe, setTimeframe] = useState("");
  // Category selection removed
  const router = useRouter();

  // Mutually exclusive logic
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    setTimeframe("");
  };
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value);
    setDate("");
  };

  const [error, setError] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!date && !timeframe) {
      setError("Please select either date or timeframe.");
      return;
    }
    const params = new URLSearchParams();
    if (date) params.append("date", date);
    if (timeframe) params.append("timeframe", timeframe);
    router.push(`/article-nav/results?${params.toString()}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white dark:bg-slate-900 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-300">Article Navigation</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="text-red-600 mb-4 text-center">{error}</div>
        )}
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Select Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800 dark:text-gray-100"
            value={date}
            onChange={handleDateChange}
            disabled={!!timeframe}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">Or Select Timeframe</label>
          <select
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-slate-800 dark:text-gray-100"
            value={timeframe}
            onChange={handleTimeframeChange}
            disabled={!!date}
          >
            <option value="">-- Select Timeframe --</option>
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition">Show Articles</button>
      </form>
    </div>
  );
}
