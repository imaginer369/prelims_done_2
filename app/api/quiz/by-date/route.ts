import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { difficultyMap, topicMap } from "@/lib/quizMappings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const numQuestions = parseInt(searchParams.get("numQuestions") || "10", 10);
  const difficulty = searchParams.get("difficulty");
  const topic = searchParams.get("topic");

  // Map difficulty and topic to int codes (null means any)
  const difficultyCode = difficultyMap[difficulty as keyof typeof difficultyMap];
  const topicCode = topicMap[topic as keyof typeof topicMap];

  // Build Supabase query: join quiz_questions with options, filter by question_date, topic, difficulty
  let query = supabase
    .from("quiz_questions")
    .select(`
      question_id,
      article_id,
      concept_id,
      date,
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
    .gte("date", date + "T00:00:00")
    .lt("date", date + "T23:59:59.999")
  ;

  if (difficultyCode !== null && difficultyCode !== undefined) {
    query = query.eq("difficulty", difficultyCode);
  }
  if (topicCode !== null && topicCode !== undefined) {
    query = query.eq("topic", topicCode);
  }

  // Fetch all matching questions
  const { data, error } = await query;
  if (error) {
    console.error("Supabase error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  // Shuffle and limit to numQuestions
  let questions = data || [];
  if (questions.length > numQuestions) {
    questions = questions.sort(() => Math.random() - 0.5).slice(0, numQuestions);
  }

  return new Response(JSON.stringify({ questions }), { status: 200 });
}
