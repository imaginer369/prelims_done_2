"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Article {
  id: number;
  title: string;
  content: string;
  image_url: string;
  published_at: string;
}
export default function NewsCarousel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading articles...</div>;
  }

  if (!articles.length) {
    return <div className="text-center mt-10">No articles found.</div>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      className="my-8"
    >
      {articles.map((article) => (
        <SwiperSlide key={article.id}>
          <div className="h-screen flex flex-col">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-1/2 object-cover"
            />
            <div className="p-4 h-1/2 overflow-auto">
              <h2 className="text-2xl font-bold">{article.title}</h2>
              <p className="mt-2 text-gray-700">{article.content}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
