"use client";
import { useRef, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import ArticleSlide from "./ArticleSlide";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Article {
  id: number;
  title: string;
  quick_summary: string;
  content: string;
  image_url: string;
  published_at: string;
}


interface DateArticlesCarouselProps {
  articles: Article[];
}

export default function DateArticlesCarousel({ articles }: DateArticlesCarouselProps) {
  const swiperRef = useRef<{ slidePrev: () => void; slideNext: () => void } | null>(null);

  // Keyboard navigation (left/right arrows, A/D)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (window.matchMedia("(pointer: fine)").matches) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          swiperRef.current?.slidePrev();
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          swiperRef.current?.slideNext();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Only render if there are articles
  if (!articles.length) {
    return null;
  }

  return (
    <Swiper
      modules={[]}
      spaceBetween={30}
      slidesPerView={1}
      className="m-0 p-0"
      onSwiper={(swiper) => (swiperRef.current = swiper)}
    >
      {articles.map((article) => (
        <SwiperSlide key={article.id} className="m-0 p-0">
          <ArticleSlide article={article} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
