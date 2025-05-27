// components/FloatingButtons.tsx
import Link from "next/link";

export default function FloatingButtons() {
  return (
    <>
      {/* Quiz Button */}
      <Link href="/quiz">
        <button className="fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700">
          Test
        </button>
      </Link>
      {/* Login Button */}
      <Link href="/login">
        <button className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700">
          Login
        </button>
      </Link>
    </>
  );
}

