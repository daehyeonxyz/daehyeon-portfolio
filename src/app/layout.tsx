import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Daehyeon - Portfolio",
  description: "Minimal portfolio showcasing creative works",
  openGraph: {
    title: "Daehyeon",
    description: "Minimal portfolio showcasing creative works",
    url: "https://daehyeon.xyz",
    siteName: "Daehyeon",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white">
        <Providers>
          <Navigation />
          <main>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}