import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { difficultyMap, topicMap } from "@/lib/quizMappings";

const timeframeToDays = {
  "1w": 7,
  "2w": 14,
  "1m": 30,
  "2m": 60,
  "4m": 120,
  "6m": 180,
  "9m": 270,
  "1y": 365,
  "2y": 730,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const timeframe = searchParams.get("timeframe") || "1w";
  const numQuestions = parseInt(searchParams.get("numQuestions") || "10", 10);
  const difficulty = searchParams.get("difficulty");
  const topic = searchParams.get("topic");

  // Map difficulty and topic to int codes (null means any)
  const difficultyCode = difficultyMap[difficulty as keyof typeof difficultyMap];
  const topicCode = topicMap[topic as keyof typeof topicMap];

  // Calculate date range
  const days = timeframeToDays[timeframe as keyof typeof timeframeToDays] || 7;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  const startStr = startDate.toISOString().slice(0, 10) + "T00:00:00";
  const endStr = endDate.toISOString().slice(0, 10) + "T23:59:59.999";

  // Use Supabase RPC to fetch random questions by timeframe
  const { data, error } = await supabase.rpc('get_random_questions_by_timeframe', {
    start_date: startStr,
    end_date: endStr,
    num_questions: numQuestions,
    difficulty: difficultyCode ?? null,
    topic: topicCode ?? null
  });
  if (error) {
    console.error("Supabase RPC error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ questions: data }), { status: 200 });
}
