import type { Metadata, Viewport } from "next";
import { Quicksand, Corinthia } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const corinthia = Corinthia({
  variable: "--font-corinthia",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Walimatul Urus",
  description: "Wedding Invitation - Walimatul Urus",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Walimatul Urus",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full overflow-hidden">
      <body className={`${quicksand.variable} ${corinthia.variable} h-full overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
