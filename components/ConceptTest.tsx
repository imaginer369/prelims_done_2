"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // adjust if your supabase client is elsewhere

type Concept = {
  id: string;
  name: string;
  info: string;
};

interface ConceptTestProps {
  articleId: string;
}

export default function ConceptTest({ articleId }: ConceptTestProps) {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConcepts = async () => {
      const { data, error } = await supabase
        .from("articles_concepts")
        .select(`
          concept:concepts (
            id,
            name,
            info
          )
        `)
        .eq("article_id", articleId);

      if (error) {
        console.error("Error fetching concepts:", error.message);
        setError(error.message);
      } else {
        console.log("Concepts fetched:", data);
        const extractedConcepts = data.map((entry) => entry.concept);
        setConcepts(extractedConcepts);
      }
    };

    if (articleId) {
      fetchConcepts();
    }
  }, [articleId]);

  return (
    <div className="p-4 border rounded shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Concept Test Output</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      {concepts.length === 0 ? (
        <p>No concepts found for this article.</p>
      ) : (
        <ul className="list-disc pl-6">
          {concepts.map((concept) => (
            <li key={concept.id}>
              <strong>{concept.name}</strong>: {concept.info}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

