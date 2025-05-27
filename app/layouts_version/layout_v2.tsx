// app/layout.tsx
import "../styles/globals.css";

export const metadata = {
  title: "Prelims Done",
  description: "Daily news & quizzes for UPSC IAS Prelims preparation",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white">
        {/* Removed Navbar */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}

