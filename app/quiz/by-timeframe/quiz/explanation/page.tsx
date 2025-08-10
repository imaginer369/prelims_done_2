"use client";
// import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { marked } from "marked";

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
  question_date: string;
  text: string;
  topic: number;
  difficulty: number;
  options: Option[];
}

function ExplanationInner() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [question_id: number]: number | null }>({});
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const data = localStorage.getItem("byTimeframeQuizData");
      if (data) {
        const parsed = JSON.parse(data);
        setQuestions(parsed.questions || []);
        setAnswers(parsed.answers || {});
        localStorage.removeItem("byTimeframeQuizData");
        setError("");
      } else {
        setError("No quiz data found. Please complete a quiz first.");
      }
    } catch {
      setError("Failed to load quiz data.");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-300 mb-6"></div>
        <div className="text-lg text-blue-700 dark:text-blue-200 font-semibold tracking-wide">Loading explanations...</div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 font-semibold text-lg py-8">{error}</div>;
  }
  if (!questions.length) {
    return <div className="text-gray-500 text-lg py-8">No questions found for the selected criteria.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200 text-center">Quiz Explanations</h1>
      <ol className="space-y-8">
        {questions.map((q: Question, idx: number) => {
          const userSelected = answers[q.question_id];
          const correctOption = q.options.find((o: Option) => o.is_correct)?.option_id;
          return (
            <li key={q.question_id} className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 border border-blue-100 dark:border-slate-700">
              <div className="font-semibold mb-3 prose prose-blue dark:prose-invert max-w-none mb-3">Q{idx + 1}. <span dangerouslySetInnerHTML={{ __html: marked.parse(q.text) }} /></div>
              <ul className="space-y-2 mb-3">
                {q.options.map((opt: Option) => {
                  let optionClass = "";
                  if (userSelected == null) {
                    // User did not select any option: only highlight correct
                    if (opt.option_id === correctOption) {
                      optionClass = "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 font-bold";
                    }
                  } else if (userSelected === opt.option_id && userSelected !== correctOption) {
                    optionClass = "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 font-bold";
                  } else if (opt.option_id === correctOption) {
                    optionClass = "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 font-bold";
                  }
                  return (
                    <li key={opt.option_id} className={`flex flex-col border rounded-lg px-3 py-2 mb-1 ${optionClass}`}>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name={`q_${q.question_id}_explanation`}
                          id={`opt_${opt.option_id}_explanation`}
                          checked={userSelected === opt.option_id}
                          readOnly
                          disabled
                        />
                        <label htmlFor={`opt_${opt.option_id}_explanation`} className="ml-2">{opt.option_text}</label>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">{opt.explanation}</div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function ExplanationPage() {
  return (
    <Suspense>
      <ExplanationInner />
    </Suspense>
  );
}
