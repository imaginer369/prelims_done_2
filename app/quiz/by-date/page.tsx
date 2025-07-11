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

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export default function QuizByDate() {
  const [date, setDate] = useState(getYesterday());
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("Mix");
  const [topic, setTopic] = useState("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      date,
      numQuestions: numQuestions.toString(),
      difficulty,
      topic,
    });
    window.location.href = `/quiz/by-date/quiz?${params.toString()}`;
  };

  return (
    <QuizSelectionForm
      title="Quiz by Article Date"
      showDate={true}
      date={date}
      setDate={setDate}
      numQuestions={numQuestions}
      setNumQuestions={setNumQuestions}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      topic={topic}
      setTopic={setTopic}
      topics={topics}
      difficulties={difficulties}
      onSubmit={handleSubmit}
      getYesterday={getYesterday}
    />
  );
}
