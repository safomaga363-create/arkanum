import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "ARKANUM — Premium Ethical Hacking Arena",
    template: "%s | ARKANUM",
  },
  description:
    "The premier platform for competitive ethical hacking, CTF challenges, and cybersecurity learning. Earn USDT prizes in paid contests. White-hat only.",
  keywords: [
    "ethical hacking",
    "cybersecurity",
    "CTF",
    "hacking challenges",
    "bug bounty",
    "USDT",
    "white hat",
    "infosec",
    "penetration testing",
  ],
  authors: [{ name: "ARKANUM" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ARKANUM",
    title: "ARKANUM — Premium Ethical Hacking Arena",
    description:
      "Master cybersecurity. Compete for USDT prizes. Climb the ranks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARKANUM — Premium Ethical Hacking Arena",
    description:
      "Master cybersecurity. Compete for USDT prizes. Climb the ranks.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
