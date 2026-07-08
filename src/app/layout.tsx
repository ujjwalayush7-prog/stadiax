import type { Metadata } from "next";
import { Outfit, Bebas_Neue } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StadiaX | FIFA 2026 GenAI Operations",
  description: "Generative AI enabled stadium operations and fan experience solution for FIFA World Cup 2026. Leveraging AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, and real-time decision support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${bebas.variable}`}>
      <body>{children}</body>
    </html>
  );
}
