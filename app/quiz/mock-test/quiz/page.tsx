"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import QuizTimer from "@/components/Quiz/QuizTimer";
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

function MockTestQuizInner() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [question_id: number]: number | null }>({});
  const [submitted, setSubmitted] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const totalSecondsRef = useRef(0);

  useEffect(() => {
    if (!searchParams) return;
    const numQuestions = searchParams.get("numQuestions");
    const difficulty = searchParams.get("difficulty");
    const topic = searchParams.get("topic");
    const timeLimit = Number(searchParams.get("timeLimit")) || 600;
    setLoading(true);
    fetch(`/api/quiz/mock-test?numQuestions=${encodeURIComponent(numQuestions || "100")}&difficulty=${encodeURIComponent(difficulty || "Mix")}&topic=${encodeURIComponent(topic || "All")}`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched quiz data:", data);
        setQuestions((data.questions as Question[]) || []);
        setError("");
        setLoading(false);
        setSecondsLeft(timeLimit);
        totalSecondsRef.current = timeLimit;
        setTimerStarted(true);
      })
      .catch(err => {
        setError("Failed to fetch questions");
        setLoading(false);
        console.error(err);
      });
  }, [searchParams]);
  // Timer effect
  useEffect(() => {
    if (!timerStarted || submitted) return;
    if (secondsLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerStarted, secondsLeft, submitted]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 dark:border-blue-300 mb-6"></div>
      <div className="text-lg text-blue-700 dark:text-blue-200 font-semibold tracking-wide">Loading quiz...</div>
    </div>
  );
  if (error) return <div className="text-red-500 font-semibold text-lg py-8">{error}</div>;
  if (!questions.length) return <div className="text-gray-500 text-lg py-8">No questions found for the selected criteria.</div>;

  const q = questions[current];
  const handleOption = (option_id: number) => {
    if (submitted) return;
    setAnswers(a => ({ ...a, [q.question_id]: option_id }));
  };
  const handlePrev = () => setCurrent(c => Math.max(0, c - 1));
  const handleNext = () => setCurrent(c => Math.min(questions.length - 1, c + 1));
  const handleSubmit = () => setSubmitted(true);

  // Score calculation
  let score = 0;
  if (submitted) {
    score = questions.reduce((acc, ques) => {
      const selected = answers[ques.question_id];
      const correct = ques.options.find(o => o.is_correct)?.option_id;
      return acc + (selected === correct ? 1 : 0);
    }, 0);
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 relative">
      {!submitted && timerStarted && secondsLeft > 0 && (
        <QuizTimer
          totalSeconds={totalSecondsRef.current}
          secondsLeft={secondsLeft}
          onTimeUp={() => setSubmitted(true)}
          isRunning={!submitted}
        />
      )}
      <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-200 text-center">Mock Test</h1>
      {submitted ? (
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 dark:from-blue-900 dark:via-slate-800 dark:to-blue-900 shadow-xl px-8 py-6 mb-4">
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-200 mb-2 text-center">Score</div>
            <div className="text-5xl font-extrabold text-green-600 dark:text-green-300 mb-2 text-center">{score} / {questions.length}</div>
            <div className="text-lg text-gray-700 dark:text-gray-200 text-center">Well done!</div>
          </div>
          <button
            className="mt-2 px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg shadow"
            onClick={() => {
              if (!searchParams) return;
              const params = new URLSearchParams(searchParams.toString());
              params.set("answers", encodeURIComponent(JSON.stringify(answers)));
              window.location.href = `/quiz/mock-test/quiz/explanation?${params.toString()}`;
            }}
          >
            Explanation
          </button>
        </div>
      ) : null}
      {!submitted && (
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow p-6 border border-blue-100 dark:border-slate-700">
            <div className="font-semibold mb-3 prose prose-blue dark:prose-invert max-w-none mb-3">Q{current + 1}. <span dangerouslySetInnerHTML={{ __html: marked.parse(q.text) }} /></div>
            <ul className="space-y-2">
              {q.options?.map((opt) => (
                <li key={opt.option_id} className="flex items-center">
                  <input
                    type="radio"
                    name={`q_${q.question_id}`}
                    id={`opt_${opt.option_id}`}
                    className="mr-2"
                    checked={answers[q.question_id] === opt.option_id}
                    onChange={() => handleOption(opt.option_id)}
                    disabled={submitted}
                  />
                  <label htmlFor={`opt_${opt.option_id}`}>{opt.option_text}</label>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between mt-6 gap-4">
            <button
              className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
              onClick={handlePrev}
              disabled={current === 0}
            >
              Prev
            </button>
            {current < questions.length - 1 ? (
              <button
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MockTestQuiz() {
  return (
    <Suspense>
      <MockTestQuizInner />
    </Suspense>
  );
}
