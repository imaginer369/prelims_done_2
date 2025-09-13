import "../styles/globals.css";
import HeaderMenu from "../components/HeaderMenu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { User as UserIcon } from "lucide-react";
import ThemeClientEffect from "../components/ThemeClientEffect";

import BottomNavClientWrapper from "../components/BottomNavClientWrapper";

export const metadata = {
  title: "Prelims Done",
  description: "UPSC Article Reading - Swipeable Articles",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

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
    <>
      <ThemeClientEffect />
      {/* Header with Logo and Menu */}
      <header className="w-full bg-white dark:bg-slate-900 p-4 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HeaderMenu />
            <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-200 drop-shadow-lg">
              prelims done
            </h1>
          </div>
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 border-2 border-white/80 dark:border-slate-800"
            aria-label={user ? "Profile" : "Login"}
            onClick={() => router.push(user ? "/profile" : "/login")}
          >
            <UserIcon className="w-7 h-7" />
          </button>
        </div>
      </header>
      {/* Main content */}
      <main className="m-0 p-0 bg-white dark:bg-slate-900 text-black dark:text-white min-h-screen pb-16">
        {children}
      </main>
      {/* Bottom Navigation Bar */}
      <div className="block">
        {/* Show on all screen sizes */}
        <BottomNavClientWrapper />
      </div>
    </>
  );
}





