"use client";

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

const articles: Article[] = [
  {
    id: 1,
    title: "Recent UPSC Update",
    content: "Details about the most recent UPSC update...",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb0FQC7fx2fTPBiVVEiTP-loJsHs3LzpJa5Q&s",
    date: "2025-03-24",
  },
  {
    id: 2,
    title: "Older UPSC Insights",
    content: "Insights from an older UPSC article...",
    imageUrl: "https://i.pinimg.com/736x/f9/d9/ce/f9d9cef6f74efd5f000e2dadd0306a54.jpg",
    date: "2025-03-23",
  },
  // Additional articles...
];

export default function NewsCarousel() {
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
          {/* Container set to full viewport height on mobile */}
          <div className="h-screen md:h-auto flex flex-col">
            <img
              src={article.imageUrl}
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
