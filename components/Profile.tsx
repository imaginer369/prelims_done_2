"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;
  if (!user) return <div className="text-center mt-10 text-red-500">No user found.</div>;

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-200">Profile</h2>
      <div className="mb-4 text-lg text-gray-800 dark:text-white">
        <div><span className="font-semibold">User ID:</span> {user.id}</div>
        <div><span className="font-semibold">Email:</span> {user.email}</div>
        <div><span className="font-semibold">Name:</span> {user.user_metadata?.name || "-"}</div>
      </div>
    </div>
  );
}
