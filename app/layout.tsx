import type { Metadata } from "next";
import { Geist_Mono, Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-lux",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["italic", "normal"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salon Booking System",
  description: "Book your salon appointment online in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
