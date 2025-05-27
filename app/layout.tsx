import type { Metadata } from "next";
import { Quicksand, Oleo_Script_Swash_Caps } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const oleoScriptSwashCaps = Oleo_Script_Swash_Caps({
  variable: "--font-oleo-script-swash-caps",
  subsets: ["latin"],
  weight: ["400", "700"],
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
      <body className={`${quicksand.variable} ${oleoScriptSwashCaps.variable}`}>
        {children}
      </body>
    </html>
  );
}
