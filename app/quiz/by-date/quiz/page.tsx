"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizByDateQuiz() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  interface Option {
    option_id: number;
    question_id: number;
    option_text: string;
    is_correct: boolean;
    explanation: string;
  }

  interface Question {
    question_id: number;
    article_id: number;
    concept_id: number;
    date: string;
    text: string;
    topic: number;
    difficulty: number;
    options: Option[];
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchParams) return;
    const date = searchParams.get("date");
    const numQuestions = searchParams.get("numQuestions");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");
    if (!date) return;
    setLoading(true);
    fetch(`/api/quiz/by-date?date=${encodeURIComponent(date)}&numQuestions=${encodeURIComponent(numQuestions || "10")}&difficulty=${encodeURIComponent(difficulty || "Mix")}&topic=${encodeURIComponent(topic || "All")}`)
      .then(res => res.json())
      .then(data => {
        setQuestions((data.questions as Question[]) || []);
        setError("");
        setLoading(false);
        // For diagnosis
        console.log("Fetched quiz questions:", data.questions);
      })
      .catch(err => {
        setError("Failed to fetch questions");
        setLoading(false);
        console.error(err);
      });
  }, [searchParams]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh] text-lg">Loading quiz...</div>;
  if (error) return <div className="text-red-500 font-semibold text-lg py-8">{error}</div>;
  if (!questions.length) return <div className="text-gray-500 text-lg py-8">No questions found for the selected criteria.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200 text-center">Quiz</h1>
      <ol className="space-y-8">
        {questions.map((q, idx) => (
          <li key={q.question_id} className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 border border-blue-100 dark:border-slate-700">
            <div className="font-semibold mb-3">Q{idx + 1}. {q.text}</div>
            <ul className="space-y-2">
              {q.options?.map((opt) => (
                <li key={opt.option_id} className="flex items-center">
                  <input type="radio" name={`q_${q.question_id}`} id={`opt_${opt.option_id}`} className="mr-2" disabled />
                  <label htmlFor={`opt_${opt.option_id}`}>{opt.option_text}</label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
