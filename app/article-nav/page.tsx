"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./article-nav.module.css";

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
    <div className={styles.container}>
      <h1 className={styles.title}>Article Navigation</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        )}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Select Date</label>
          <input
            type="date"
            className={styles.input}
            value={date}
            onChange={handleDateChange}
            disabled={!!timeframe}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Or Select Timeframe</label>
          <select
            className={styles.input}
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
        {/* Category selection removed */}
        <button type="submit" className={styles.submitButton}>Show Articles</button>
      </form>
    </div>
  );
}
