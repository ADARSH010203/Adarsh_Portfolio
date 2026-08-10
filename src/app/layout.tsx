import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adarsh Kumar | AI/ML Engineer",
  description:
    "Portfolio of Adarsh Kumar — AI/ML Engineer specializing in Generative AI, RAG, LLMs, Multi-Agent Systems, and Full-Stack AI Applications.",
  keywords: [
    "Adarsh Kumar",
    "AI Engineer",
    "ML Engineer",
    "Generative AI",
    "RAG",
    "LLM",
    "Multi-Agent Systems",
    "Portfolio",
  ],
  authors: [{ name: "Adarsh Kumar" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧠</text></svg>",
  },
  openGraph: {
    title: "Adarsh Kumar | AI/ML Engineer",
    description: "Building the future with AI — Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning style={{ backgroundColor: '#030014' }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground noise-overlay`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
