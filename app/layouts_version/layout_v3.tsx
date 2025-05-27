// app/layout.tsx
import "../styles/globals.css";

export const metadata = {
  title: "Prelims Done",
  description: "UPSC Article Reading",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white m-0 p-0">
        {/* No header included */}
        <main>{children}</main>
      </body>
    </html>
  );
}

