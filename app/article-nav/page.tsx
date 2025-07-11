"use client";
import Link from "next/link";
import styles from "./article-nav.module.css";

export default function ArticleNavPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Article Navigation</h1>
      <div className={styles.buttonGroup}>
        <Link href="/articles-by-date" className={styles.button}>
          Select Article by Dates
        </Link>
        <Link href="/articles-by-category" className={styles.button}>
          Select Article by Categories
        </Link>
      </div>
    </div>
  );
}
