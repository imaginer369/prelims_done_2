import { useRouter } from "next/navigation";
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
  const [concept, setConcept] = useState<Concept | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get id from URL
  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    if (!id) return;
    async function fetchConcept() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/concept?id=${id}`);
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
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 text-black dark:text-white flex flex-col items-center justify-center py-8 px-2">
      <section className="w-full max-w-2xl rounded-xl shadow-lg p-8 bg-white dark:bg-slate-900 border border-blue-100 dark:border-slate-700">
        <button className="mb-6 px-4 py-2 rounded bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-slate-700 transition" onClick={() => router.back()}>
          ← Back
        </button>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></span>
            <span className="text-blue-600 dark:text-blue-300 font-medium text-lg">Loading concept...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 font-semibold text-lg py-8">{error}</div>
        ) : concept ? (
          <>
            <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-200">{concept.name}</h1>
            <div className="prose prose-blue dark:prose-invert max-w-none mb-6 text-lg text-gray-800 dark:text-white animate-fade-in bg-white dark:bg-slate-900">
              <Suspense fallback={<div>Loading markdown...</div>}>
                <LazyReactMarkdown remarkPlugins={[remarkGfm]}>
                  {concept.info}
                </LazyReactMarkdown>
              </Suspense>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
