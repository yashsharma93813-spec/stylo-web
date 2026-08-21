import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// App Metadata for SEO & PWA installation
export const metadata: Metadata = {
  title: "Stylo - AI Personal Stylist",
  description: "AI-powered personal stylist and smart wardrobe intelligence.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Stylo AI",
  },
};

// Mobile Viewport settings for native app touch feeling
export const viewport: Viewport = {
  themeColor: "#0A0A0C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0A0A0C] text-neutral-100 antialiased selection:bg-rose-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}