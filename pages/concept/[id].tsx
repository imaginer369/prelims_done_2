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
  }, [id]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-2 py-10 sm:py-16">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-200 dark:bg-cyan-900 rounded-full opacity-20 blur-2xl animate-pulse delay-1000" />
      </div>
      <section className="relative z-10 w-full max-w-3xl mx-auto bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 px-6 sm:px-12 py-10 sm:py-14 flex flex-col items-center animate-fade-in">
        <button
          className="absolute left-6 top-6 sm:left-10 sm:top-10 px-5 py-2 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-200 font-semibold shadow hover:bg-blue-200 dark:hover:bg-slate-700 transition text-base sm:text-lg"
          onClick={() => router.back()}
        >
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-200 mb-6 text-center drop-shadow tracking-tight leading-tight">
              {concept.name}
            </h1>
            <div className="w-full flex flex-col items-center">
              <div className="prose prose-lg sm:prose-xl prose-indigo dark:prose-invert max-w-none bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-slate-800 shadow-md text-gray-800 dark:text-white animate-fade-in">
                <Suspense fallback={<div>Loading markdown...</div>}>
                  <LazyReactMarkdown remarkPlugins={[remarkGfm]}>
                    {concept.info}
                  </LazyReactMarkdown>
                </Suspense>
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
