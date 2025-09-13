"use client";
// components/Navbar.tsx

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    let ignore = false;
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (!ignore) setUser(data?.user || null);
    }
    checkUser();
    return () => { ignore = true; };
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold">
            <Link href="/">Prelims Done</Link>
          </h1>
          <button
            className="hover:underline px-4 py-1 rounded bg-blue-700 text-white font-medium"
            onClick={() => router.push(user ? "/profile" : "/login")}
          >
            {user ? "Profile" : "Login"}
          </button>
        </div>
        <div className="space-x-4 flex items-center">
          <Link href="/news" className="hover:underline">
            News
          </Link>
          <Link href="/quiz" className="hover:underline">
            Quiz
          </Link>
          <Link href="/articles-by-date" className="hover:underline font-semibold text-yellow-300">
            Articles by Date
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
