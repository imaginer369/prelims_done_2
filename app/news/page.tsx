// app/news/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNavClientWrapper from "../../components/BottomNavClientWrapper";

export default function NewsPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to homepage on mount
    router.replace("/");
  }, [router]);

  return (
    <>
      {/* Keep BottomNav visible even during redirect */}
      <div className="min-h-screen flex flex-col justify-end">
        <BottomNavClientWrapper />
      </div>
    </>
  );
}
