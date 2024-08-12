import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import the Connectkit configuration
import { ParticleConnectkit } from "./components/Connectkit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Particle Connect 2.0 Quickstart demo",
  description: "Demo showcasing a quickstart for Particle Connect 2.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ParticleConnectkit>{children}</ParticleConnectkit>
      </body>
    </html>
  );
}
