"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../article-nav.module.css";

interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
}

export default function ArticleResultsPage() {
  const params = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const query: Record<string, string> = {};
      if (params.get("date")) query.date = params.get("date")!;
      if (params.get("timeframe")) query.timeframe = params.get("timeframe")!;
      if (params.get("category")) query.category = params.get("category")!;
      const search = new URLSearchParams(query).toString();
      const res = await fetch(`/api/articles?${search}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setLoading(false);
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.toString()]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Articles</h1>
      {loading ? (
        <div>Loading...</div>
      ) : articles.length === 0 ? (
        <div>No articles found for the selected options.</div>
      ) : (
        <div className={styles.articlesList}>
          {articles.map(article => (
            <div key={article.id} className={styles.articleCard}>
              <div className={styles.articleHeader}>
                <span className={styles.articleCategory}>{article.category}</span>
                <span className={styles.articleDate}>{article.date}</span>
              </div>
              <h2 className={styles.articleTitle}>{article.title}</h2>
              <p className={styles.articleSummary}>{article.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
