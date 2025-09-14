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
    <main className="concept-bg">
      <div className="concept-decor">
        <div className="circle1" />
        <div className="circle2" />
      </div>
      <section className="concept-section">
        <button className="concept-back-btn" onClick={() => router.back()}>
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
            <h1 className="concept-title">{concept.name}</h1>
            <div className="concept-markdown">
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
