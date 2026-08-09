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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground noise-overlay`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var o=new MutationObserver(function(m){m.forEach(function(mu){if(mu.type==='childList'){mu.addedNodes.forEach(function(n){if(n.nodeType===1&&n.getAttribute&&n.getAttribute('fdprocessedid')){n.removeAttribute('fdprocessedid')}})};}if(mu.type==='attributes'&&mu.attributeName==='fdprocessedid'){mu.target.removeAttribute('fdprocessedid')}})});o.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['fdprocessedid']});var _e=console.error;console.error=function(){var m=arguments[0]&&arguments[0].toString?arguments[0].toString():'';if(m.indexOf('hydrated but some attributes')!==-1&&m.indexOf('fdprocessedid')!==-1)return;_e.apply(console,arguments)};})();`,
          }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
