"use client";
import { useState } from "react";
import QuizSelectionForm from "@/components/Quiz/QuizSelectionForm";

const timeframes = [
  { label: "Last 1 week", value: "1w" },
  { label: "Last 2 weeks", value: "2w" },
  { label: "Last 1 month", value: "1m" },
  { label: "Last 2 months", value: "2m" },
  { label: "Last 4 months", value: "4m" },
  { label: "Last 6 months", value: "6m" },
  { label: "Last 9 months", value: "9m" },
  { label: "Last 1 year", value: "1y" },
  { label: "Last 2 years", value: "2y" },
];

const topics = [
  "All",
  "Current Events of National and International Importance",
  "History of India and Indian National Movement",
  "Indian and World Geography - Physical, Social, Economic Geography of India and the World",
  "Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.",
  "Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.",
  "General Issues on Environmental Ecology, Bio-diversity and Climate Change - that do not require subject specialization",
  "General Science"
];

const difficulties = ["Mix", "Easy", "Medium", "Hard", "Super Hard"];

  const [timeframe, setTimeframe] = useState("1w");
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Mix");
  const [topic, setTopic] = useState("All");
  const [timeLimit, setTimeLimit] = useState(600); // default 10 minutes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      timeframe,
      numQuestions: numQuestions.toString(),
      difficulty,
      topic,
      timeLimit: timeLimit.toString(),
    });
    window.location.href = `/quiz/by-timeframe/quiz?${params.toString()}`;
  };

  return (
    <QuizSelectionForm
      title="Quiz by Timeframe"
      showTimeframe={true}
      timeframe={timeframe}
      setTimeframe={setTimeframe}
      numQuestions={numQuestions}
      setNumQuestions={setNumQuestions}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      topic={topic}
      setTopic={setTopic}
      topics={topics}
      difficulties={difficulties}
      onSubmit={handleSubmit}
      timeLimit={timeLimit}
      setTimeLimit={setTimeLimit}
    />
  );
}
