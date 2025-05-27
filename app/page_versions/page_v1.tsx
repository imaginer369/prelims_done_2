// app/page.tsx
export default function Home() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">Welcome to Prelims Done</h1>
      <p className="mt-2 text-gray-600">
        Your daily UPSC news and quizzes for a smarter preparation.
      </p>
      <div className="flex justify-center space-x-4 mt-6">
        <a
          href="/news"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Read News
        </a>
        <a
          href="/quiz"
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Take a Quiz
        </a>
      </div>
    </div>
  );
}

