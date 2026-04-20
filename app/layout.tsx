import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRISON ISLAND",
  description: "30 cells. 4 players. One chance to escape.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080808] text-white antialiased min-h-screen">{children}</body>
    </html>
  );
}
