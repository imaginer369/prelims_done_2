"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface ConceptType {
  concept_name: string;
  stars: number;
  concept_id: number;
  published_at: string;
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export default function ConceptsPage() {


  const searchParams = useSearchParams();
  const initialDate = searchParams?.get("date") || formatDate(new Date());
  const [date, setDate] = useState(initialDate);
  const [concepts, setConcepts] = useState<ConceptType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openStars, setOpenStars] = useState<number | null>(null);
  const router = useRouter();

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
    const newDate = formatDate(d);
    setDate(newDate);
    router.replace(`/concepts?date=${newDate}`);
  }

  // Group concepts by stars
  const grouped: Record<number, ConceptType[]> = concepts.reduce((acc, concept) => {
    if (!acc[concept.stars]) acc[concept.stars] = [];
    acc[concept.stars].push(concept);
    return acc;
  }, {} as Record<number, ConceptType[]>);

  // Helper to render stars
  function renderStars(stars: number) {
    return <span className="text-yellow-500">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>;
  }

  // Handle concept click
  function handleConceptClick(concept_id: number) {
    router.push(`/concept/${concept_id}?date=${date}`);
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
          onChange={e => {
            setDate(e.target.value);
            router.replace(`/concepts?date=${e.target.value}`);
          }}
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
      {/* Accordion for star categories */}
      <div className="space-y-4 mt-4">
        {[5,4,3,2,1].map(stars => (
          grouped[stars] && grouped[stars].length > 0 && (
            <div key={stars} className="border rounded bg-white dark:bg-slate-900">
              <button
                className="w-full flex justify-between items-center px-4 py-3 font-semibold text-lg text-blue-700 dark:text-blue-200 focus:outline-none"
                onClick={() => setOpenStars(openStars === stars ? null : stars)}
                aria-expanded={openStars === stars}
              >
                <span>{renderStars(stars)} Concepts ({grouped[stars].length})</span>
                <span>{openStars === stars ? "▲" : "▼"}</span>
              </button>
              {openStars === stars && (
                <ul className="divide-y divide-blue-100 dark:divide-slate-800">
                  {grouped[stars].map((concept) => (
                    <li key={concept.concept_id} className="p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-slate-800 rounded"
                        onClick={() => handleConceptClick(concept.concept_id)}
                        tabIndex={0}
                        role="button"
                        aria-label={`View details for ${concept.concept_name}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-800 dark:text-blue-200 text-lg">{concept.concept_name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {concept.published_at ? new Date(concept.published_at).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
}
