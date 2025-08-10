
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

  // Special logic: both 'Mix' difficulty and 'All' topic selected
  if (difficulty === 'Mix' && topic === 'All') {
    const difficulties = [0, 1, 2, 3];
    const topics = [0, 1, 2, 3, 4, 5, 6];
    const pairs: [number, number][] = [];
    for (const d of difficulties) {
      for (const t of topics) {
        pairs.push([d, t]);
      }
    }
    const baseCount = Math.floor(n / pairs.length);
    const remainder = n % pairs.length;
    const counts = pairs.map((_, i) => baseCount + (i < remainder ? 1 : 0));
    let allQuestions: unknown[] = [];
    for (let i = 0; i < pairs.length; i++) {
      if (counts[i] === 0) continue;
      const [d, t] = pairs[i];
      const rpcParams = {
        n: counts[i],
        from_date: date,
        to_date: nextDate,
        difficulty: d,
        topic: t
      };
      console.log(`Supabase RPC parameters for difficulty ${d}, topic ${t}:`, rpcParams);
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
    const mappedQuestions = allQuestions.map((q: any) => ({
      question_id: q.question_id,
      article_id: q.article_id,
      concept_id: q.concept_id,
      question_date: q.question_date,
      question_text: q.question_text,
      topic: q.topic,
      difficulty: q.difficulty,
      options: q.options
    }));
    return new Response(JSON.stringify({ questions: mappedQuestions }), { status: 200 });
  }
  // New strategy for 'Mix' difficulty or 'All' topic (but not both)
  if (difficulty === 'Mix' || topic === 'All') {
    let axis: 'difficulty' | 'topic';
    let values: number[];
    if (difficulty === 'Mix') {
      axis = 'difficulty';
      values = [0, 1, 2, 3];
    } else {
      axis = 'topic';
      values = [0, 1, 2, 3, 4, 5, 6];
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
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    const mappedQuestions = allQuestions.map((q: any) => ({
      question_id: q.question_id,
      article_id: q.article_id,
      concept_id: q.concept_id,
      question_date: q.question_date,
      question_text: q.question_text,
      topic: q.topic,
      difficulty: q.difficulty,
      options: q.options
    }));
    return new Response(JSON.stringify({ questions: mappedQuestions }), { status: 200 });
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
    const mappedQuestions = (data || []).map((q: any) => ({
      question_id: q.question_id,
      article_id: q.article_id,
      concept_id: q.concept_id,
      question_date: q.question_date,
      question_text: q.question_text,
      topic: q.topic,
      difficulty: q.difficulty,
      options: q.options
    }));
    return new Response(JSON.stringify({ questions: mappedQuestions }), { status: 200 });
  }
}
