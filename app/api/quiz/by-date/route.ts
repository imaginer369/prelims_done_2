
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

  // New strategy for 'Mix' difficulty or 'All' topic
  if (difficulty === 'Mix' || topic === 'All') {
    // Determine which axis to split on
    let axis: 'difficulty' | 'topic';
    let values: number[];
    if (difficulty === 'Mix') {
      axis = 'difficulty';
      values = [0, 1, 2, 3]; // Easy, Medium, Hard, Super Hard
    } else {
      axis = 'topic';
      values = [0, 1, 2, 3, 4, 5, 6]; // All topics
    }
    const baseCount = Math.floor(n / values.length);
    const remainder = n % values.length;
    const counts = values.map((_, i) => baseCount + (i < remainder ? 1 : 0));
    let allQuestions: unknown[] = [];
    for (let i = 0; i < values.length; i++) {
      if (counts[i] === 0) continue;
      const rpcParams = {
        n: counts[i],
        from_date: date,
        to_date: nextDate,
        difficulty: axis === 'difficulty' ? values[i] : difficultyCode,
        topic: axis === 'topic' ? values[i] : topicCode
      };
      console.log(`Supabase RPC parameters for ${axis} ${values[i]}:`, rpcParams);
      const { data, error } = await supabase.rpc('get_random_questions_with_options', rpcParams);
      if (error) {
        console.error("Supabase RPC error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      allQuestions = allQuestions.concat(data || []);
    }
    // Shuffle the combined questions
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    return new Response(JSON.stringify({ questions: allQuestions }), { status: 200 });
  } else {
    // Use Supabase RPC to fetch random questions by date
    const rpcParams = {
      n: n,
      from_date: date,
      to_date: nextDate,
      difficulty: difficultyCode,
      topic: topicCode
    };
    console.log("Supabase RPC parameters:", rpcParams);
    const { data, error } = await supabase.rpc('get_random_questions_with_options', rpcParams);
    if (error) {
      console.error("Supabase RPC error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    console.log("Received data from Supabase RPC:", data);
    return new Response(JSON.stringify({ questions: data }), { status: 200 });
  }
}
