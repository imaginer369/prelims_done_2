
import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { difficultyMap, topicMap } from "@/lib/quizMappings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  // get the next date from the date variable
  if (!date) {
  return new Response(JSON.stringify({ error: "Missing date parameter" }), { status: 400 });
  }
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + 1); // add one day
  const nextDate = currentDate.toISOString().split("T")[0];

  const n = parseInt(searchParams.get("numQuestions") || "10", 10);
  const difficulty = searchParams.get("difficulty");
  const topic = searchParams.get("topic");

  // Map difficulty and topic to int codes (null means any)
  const difficultyCode = difficultyMap[difficulty as keyof typeof difficultyMap];
  const topicCode = topicMap[topic as keyof typeof topicMap];

  // Use Supabase RPC to fetch random questions by date
  const { data, error } = await supabase.rpc('get_random_questions_with_options', {
    n: n,
    from_date: date,
    to_date: nextDate,
    difficulty: difficultyCode,
    topic: topicCode 
  });
  if (error) {
    console.error("Supabase RPC error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ questions: data }), { status: 200 });
}
