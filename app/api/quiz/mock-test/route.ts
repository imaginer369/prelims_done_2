import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { difficultyMap, topicMap } from "@/lib/quizMappings";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const n = parseInt(searchParams.get("numQuestions") || "100", 10);
  const difficulty = searchParams.get("difficulty");
  const topic = searchParams.get("topic");

  // Map difficulty and topic to int codes (null means any)
  const difficultyCode = difficultyMap[difficulty as keyof typeof difficultyMap];
  const topicCode = topicMap[topic as keyof typeof topicMap];

  // Calculate date range for last 3 years
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 3);
  const from_date = startDate.toISOString().slice(0, 10);
  const to_date = endDate.toISOString().slice(0, 10);

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
        from_date,
        to_date,
        difficulty: d,
        topic: t
      };
      const { data, error } = await supabase.rpc('get_random_questions_with_options', rpcParams);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      allQuestions = allQuestions.concat(data || []);
    }
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    return new Response(JSON.stringify({ questions: allQuestions }), { status: 200 });
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
        from_date,
        to_date,
        difficulty: axis === 'difficulty' ? values[i] : difficultyCode,
        topic: axis === 'topic' ? values[i] : topicCode
      };
      const { data, error } = await supabase.rpc('get_random_questions_with_options', rpcParams);
      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
      allQuestions = allQuestions.concat(data || []);
    }
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }
    return new Response(JSON.stringify({ questions: allQuestions }), { status: 200 });
  }
  // Default: single query
  const rpcParams = {
    n: n,
    from_date,
    to_date,
    difficulty: difficultyCode,
    topic: topicCode
  };
  const { data, error } = await supabase.rpc('get_random_questions_with_options', rpcParams);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ questions: data }), { status: 200 });
}
