import type { Metadata } from "next";
import { Quicksand, Corinthia } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  fallback: ['system-ui', 'arial'],
});

const corinthia = Corinthia({
  variable: "--font-corinthia",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  fallback: ['cursive'],
});

export const metadata: Metadata = {
  title: "Walimatul Urus - Ahmad Adam & Dr. Hawa",
  description: "Wedding Invitation - Ahmad Adam & Dr. Hawa - December 27th, 2025",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: '-webkit-fill-available' }}>
      <body 
        className={`${quicksand.variable} ${corinthia.variable}`}
        style={{ minHeight: '-webkit-fill-available' }}
      >
        {children}
      </body>
    </html>
  );
}
