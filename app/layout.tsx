import "../styles/globals.css";
import HeaderMenu from "../components/HeaderMenu";

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
        {/* Header with Logo and Menu */}
        <header className="w-full bg-blue-600 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">

            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              prelims done
            </h1>

            
	<HeaderMenu />
          </div>
        </header>
        {/* Main content */}
        <main className="m-0 p-0">{children}</main>
      </body>
    </html>
  );
}



