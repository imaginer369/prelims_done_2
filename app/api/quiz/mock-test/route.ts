import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { difficultyMap, topicMap } from "@/lib/quizMappings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const numQuestions = parseInt(searchParams.get("numQuestions") || "100", 10);
  const difficulty = searchParams.get("difficulty");
  const topic = searchParams.get("topic");

  // Map difficulty and topic to int codes (null means any)
  const difficultyCode = difficultyMap[difficulty as keyof typeof difficultyMap];
  const topicCode = topicMap[topic as keyof typeof topicMap];

  // Calculate date range for last 3 years
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 3);
  const startStr = startDate.toISOString().slice(0, 10) + "T00:00:00";
  const endStr = endDate.toISOString().slice(0, 10) + "T23:59:59.999";

  // Build Supabase query: join quiz_questions with options, filter by question_date, topic, difficulty
  let query = supabase
    .from("quiz_questions")
    .select(`
      question_id,
      article_id,
      concept_id,
      question_date,
      text,
      topic,
      difficulty,
      options:options(
        option_id,
        question_id,
        option_text,
        is_correct,
        explanation
      )
    `)
    .gte("question_date", startStr)
    .lte("question_date", endStr)
    .order('RANDOM()')
    .limit(numQuestions);

  if (difficultyCode !== null && difficultyCode !== undefined) {
    query = query.eq("difficulty", difficultyCode);
  }
  if (topicCode !== null && topicCode !== undefined) {
    query = query.eq("topic", topicCode);
  }

  // Fetch only the needed number of random questions
  const { data, error } = await query;
  if (error) {
    console.error("Supabase error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const questions = data || [];
  return new Response(JSON.stringify({ questions }), { status: 200 });
}
