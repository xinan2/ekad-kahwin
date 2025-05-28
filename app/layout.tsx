import type { Metadata } from "next";
import { Quicksand, Italianno } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Walimatul Urus - Ahmad Adam & Dr. Hawa",
  description: "Wedding Invitation - Ahmad Adam & Dr. Hawa - December 27th, 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} ${italianno.variable}`}>
        {children}
      </body>
    </html>
  );
}
