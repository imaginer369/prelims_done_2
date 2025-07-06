import { useRouter } from "next/router";
import { useEffect, useState, Suspense, lazy } from "react";
const LazyReactMarkdown = lazy(() => import("react-markdown"));
import remarkGfm from "remark-gfm";

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
        const res = await fetch(`/api/concepts?article_id=${id}`);
        console.log(res);
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
        <ConceptCard concept={concept} />
      ) : null}
    </div>
  );
}

function ConceptCard({ concept }: { concept: Concept }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="w-full md:w-auto max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 p-8 animate-fade-in flex flex-col items-center">
      <button
        onClick={() => setShowInfo((prev) => !prev)}
        className="px-6 py-3 mb-4 bg-blue-700 text-white font-extrabold text-2xl rounded-lg shadow hover:bg-blue-900 transition w-full"
      >
        {concept.name}
      </button>
      {showInfo && (
        <div className="prose prose-indigo dark:prose-invert mt-2 p-4 border rounded-md bg-gray-50 dark:bg-slate-800 text-lg text-gray-800 dark:text-white w-full">
          <Suspense fallback={<div>Loading markdown...</div>}>
            <LazyReactMarkdown remarkPlugins={[remarkGfm]}>
              {concept.info}
            </LazyReactMarkdown>
          </Suspense>
        </div>
      )}
    </div>
  );
}
