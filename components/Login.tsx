"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSuccess("Check your email for a confirmation link.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        setSuccess("Logged in successfully!");
        setTimeout(() => router.push("/profile"), 1000);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-200">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="px-4 py-2 rounded border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="px-4 py-2 rounded border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white w-full pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 focus:outline-none"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.175-6.125M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.125-2.175A9.96 9.96 0 0122 9c0 5.523-4.477 10-10 10a10.05 10.05 0 01-1.825-.175" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.25 2.25l3.75 3.75m-3.75-3.75A9.96 9.96 0 0122 9c0 5.523-4.477 10-10 10a9.96 9.96 0 01-6.125-2.175m2.25-2.25l-3.75-3.75" /></svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
        >
          {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <button
          className="text-blue-500 hover:underline text-sm"
          onClick={() => { setIsSignUp(false); setError(""); setSuccess(""); }}
          disabled={!isSignUp}
        >
          Already have an account?
        </button>
        <button
          className="text-blue-500 hover:underline text-sm"
          onClick={() => { setIsSignUp(true); setError(""); setSuccess(""); }}
          disabled={isSignUp}
        >
          Need to sign up?
        </button>
      </div>
      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      {success && <div className="mt-4 text-green-600 text-center">{success}</div>}
    </div>
  );
}
