"use client";
// components/Navbar.tsx

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

function Navbar() {

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-bold">
            <Link href="/">Prelims Done</Link>
          </h1>
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
