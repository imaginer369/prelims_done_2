"use client";
import { useState } from "react";
import QuizSelectionForm from "@/components/Quiz/QuizSelectionForm";

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

  const [numQuestions, setNumQuestions] = useState(100);
  const [difficulty, setDifficulty] = useState("Mix");
  const [topic, setTopic] = useState("All");
  const [timeLimit, setTimeLimit] = useState(600); // default 10 minutes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      numQuestions: numQuestions.toString(),
      difficulty,
      topic,
      timeLimit: timeLimit.toString(),
    });
    window.location.href = `/quiz/mock-test/quiz?${params.toString()}`;
  };

  return (
    <QuizSelectionForm
      title="Mock Test"
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
