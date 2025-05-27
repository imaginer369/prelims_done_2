// app/layout.tsx
import "../styles/globals.css";
import Navbar from "../components/Navbar";


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
      <body className="bg-gray-50 text-gray-800">
	<Navbar/>
        <main className="max-w-4xl mx-auto p-4">{children}</main>
        <footer className="bg-gray-200 text-center py-4">
          &copy; {new Date().getFullYear()} Prelims Done. All rights reserved.
        </footer>
      </body>
    </html>
  );
}

