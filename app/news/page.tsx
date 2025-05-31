// app/news/page.tsx
export const dynamic = "force-dynamic";

export default function News() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Latest News</h1>
      <p className="text-gray-600">Stay updated with UPSC-relevant news.</p>
      {/* Future enhancement: Render a list of news articles dynamically */}
    </div>
  );
}

