import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "K-Trip — Your Personalized Seoul Itinerary",
  description: "Tell us your favorite K-dramas and K-pop groups. We'll build a Seoul itinerary made just for you. Free, takes 1 minute.",
  openGraph: {
    title: "K-Trip — Your Personalized Seoul Itinerary",
    description: "Tell us your favorite K-dramas and K-pop groups. We'll build a Seoul itinerary made just for you. Free, takes 1 minute.",
    url: "https://k-trip-project-tawny.vercel.app",
    siteName: "K-Trip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Trip — Your Personalized Seoul Itinerary",
    description: "Tell us your favorite K-dramas and K-pop groups. We'll build a Seoul itinerary made just for you. Free, takes 1 minute.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
