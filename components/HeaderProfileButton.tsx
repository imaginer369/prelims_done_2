"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";

export default function HeaderProfileButton() {
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
    <button
      className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 border-2 border-white/80 dark:border-slate-800"
      aria-label={user ? "Profile" : "Login"}
      onClick={() => router.push(user ? "/profile" : "/login")}
    >
      <UserIcon className="w-7 h-7" />
    </button>
  );
}
