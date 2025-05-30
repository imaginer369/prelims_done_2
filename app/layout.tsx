import "../styles/globals.css";
import HeaderMenu from "../components/HeaderMenu";
import ThemeClientEffect from "../components/ThemeClientEffect";

export const metadata = {
  title: "Prelims Done",
  description: "UPSC Article Reading - Swipeable Articles",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white m-0 p-0">
        <ThemeClientEffect />
        {/* Header with Logo and Menu */}
        <header className="w-full bg-white p-4 border-b border-gray-200">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-blue-700 drop-shadow-lg">
                prelims done
              </h1>
              <HeaderMenu />
            </div>
          </div>
        </header>
        {/* Main content */}
        <main className="m-0 p-0 bg-white">{children}</main>
      </body>
    </html>
  );
}



