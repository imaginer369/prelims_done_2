"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ConceptType {
  concept_name: string;
  article_id: number;
  published_at: string;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function ConceptsPage() {
  const [date, setDate] = useState(() => formatDate(new Date()));
  const [concepts, setConcepts] = useState<ConceptType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConcepts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/direct_concepts?from_date=${date}&to_date=${date}`);
        const data = await res.json();
        if (res.ok) {
          setConcepts(data.concepts || []);
        } else {
          setError(data.error || "Failed to fetch concepts");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchConcepts();
  }, [date]);

  function changeDate(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(formatDate(d));
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">Concepts</h1>
      <div className="flex items-center gap-2 mb-6">
        <button
          className="p-2 rounded-full bg-blue-100 dark:bg-slate-800 hover:bg-blue-200 dark:hover:bg-slate-700"
          onClick={() => changeDate(-1)}
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border rounded px-2 py-1 text-lg bg-white dark:bg-slate-900"
        />
        <button
          className="p-2 rounded-full bg-blue-100 dark:bg-slate-800 hover:bg-blue-200 dark:hover:bg-slate-700"
          onClick={() => changeDate(1)}
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      {loading && <div className="text-blue-600">Loading concepts...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && concepts.length === 0 && (
        <div className="text-gray-500 italic">No concepts found for this date.</div>
      )}
      <ul className="space-y-4 mt-4">
        {concepts.map((concept, idx) => (
          <li key={concept.article_id + '-' + idx} className="p-4 rounded bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700">
            <div className="font-semibold text-blue-800 dark:text-blue-200 text-lg">{concept.concept_name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {concept.published_at ? new Date(concept.published_at).toLocaleDateString() : ''}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
