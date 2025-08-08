import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { difficultyMap, topicMap } from "@/lib/quizMappings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const numQuestions = parseInt(searchParams.get("numQuestions") || "100", 10);
  const difficulty = searchParams.get("difficulty");
  const topic = searchParams.get("topic");

  // Get user ID from Supabase Auth
  const authHeader = req.headers.get("authorization");
  let user_id = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const access_token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(access_token);
    if (userError) {
      console.error("Supabase Auth error:", userError);
      return new Response(JSON.stringify({ error: userError.message }), { status: 401 });
    }
    user_id = user?.id;
    console.log("User ID from mock-test route:", user_id);
  }
  if (!user_id) {
    return new Response(JSON.stringify({ error: "Unauthorized: No user found" }), { status: 401 });
  }

  // Map difficulty and topic to int codes (null means any)
  const difficultyCode = difficultyMap[difficulty as keyof typeof difficultyMap];
  const topicCode = topicMap[topic as keyof typeof topicMap];

  // Calculate date range for last 3 years
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 3);
  const startStr = startDate.toISOString().slice(0, 10) + "T00:00:00";
  //const endStr = endDate.toISOString().slice(0, 10) + "T23:59:59.999";

  // Use Supabase RPC to fetch random questions for mock test, passing user_id
  const { data, error } = await supabase.rpc('get_random_questions_mock_test', {
    //end_date: endStr,
    num_questions: numQuestions,
    start_date: startStr,
    difficulty: difficultyCode ?? null,
    topic: topicCode ?? null,
    user_id
  });
  if (error) {
    console.error("Supabase RPC error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ questions: data }), { status: 200 });
}
