// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">
          <Link href="/">Prelims Done</Link>
        </h1>
        <div className="space-x-4">
          <Link href="/news" className="hover:underline">
            News
          </Link>
          <Link href="/quiz" className="hover:underline">
            Quiz
          </Link>
          <Link href="/login" className="hover:underline">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

