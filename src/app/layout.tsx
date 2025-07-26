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
  title: "AMMOCAT",
  description: "Experience the future of tactical gameplay with AMMOCAT",
  keywords: "tactical, gaming, shooter, ammocat, cat, game",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${sora.variable} antialiased`}
        style={{ margin: 0, padding: 0, width: '100%', height: '100%' }}
      >
        {children}
      </body>
    </html>
  );
}
