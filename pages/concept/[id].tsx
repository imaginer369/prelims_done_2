import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Concept {
  id: number;
  name: string;
  info: string;
}

export default function ConceptDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function fetchConcept() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/concepts?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch concept");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setConcept(data[0]);
        else setError("Concept not found");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchConcept();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4 py-12">
      <button
        className="mb-8 px-6 py-2 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-slate-700 transition"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      {loading ? (
        <div className="text-blue-600 dark:text-blue-300 font-medium">Loading concept...</div>
      ) : error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : concept ? (
        <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 p-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-4">{concept.name}</h1>
          <div className="prose prose-indigo dark:prose-invert text-lg text-gray-800 dark:text-white">
            {concept.info}
          </div>
        </div>
      ) : null}
    </div>
  );
}
