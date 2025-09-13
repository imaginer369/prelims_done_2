"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NewspaperIcon, AcademicCapIcon, CalendarDaysIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function BottomNav() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

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
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-50 shadow-lg">
      <div className="flex justify-around items-center py-2">
        <button
          className={`flex flex-col items-center text-xs focus:outline-none ${pathname === "/" || pathname === "/news" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-blue-600"}`}
          onClick={() => {
            if (pathname === "/" || pathname === "/news") return;
            window.location.href = "/news";
          }}
          type="button"
        >
          <NewspaperIcon className="h-6 w-6 mb-1" />
          News
        </button>
        <Link href="/quiz" className={`flex flex-col items-center text-xs ${pathname.startsWith("/quiz") ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-blue-600"}`}>
          <AcademicCapIcon className="h-6 w-6 mb-1" />
          Quiz
        </Link>
        <Link href="/article-nav" className={`flex flex-col items-center text-xs ${pathname === "/article-nav" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-blue-600"}`}>
          <CalendarDaysIcon className="h-6 w-6 mb-1" />
          Article Nav
        </Link>
        <button
          className={`flex flex-col items-center text-xs focus:outline-none ${pathname === "/profile" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-gray-700 dark:text-gray-200 hover:text-blue-600"}`}
          onClick={() => {
            if (user) {
              router.push("/profile");
            } else {
              router.push("/login");
            }
          }}
          type="button"
        >
          <UserCircleIcon className="h-6 w-6 mb-1" />
          {user ? "Profile" : "Login"}
        </button>
      </div>
    </nav>
  );
}
