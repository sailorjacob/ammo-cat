import type { Metadata } from "next";
import { Montserrat, Sora } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMMOCAT | Tactical Gaming Experience",
  description: "Experience the future of tactical gameplay with AMMOCAT",
  keywords: "tactical, gaming, shooter, ammocat, cat, game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${sora.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
