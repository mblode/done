"use client";
import "./globals.css";

import { ZeroProvider } from "@rocicorp/zero/react";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { RootStoreProvider } from "@/lib/stores/root-store-provider";
import { createZero } from "@/lib/zero-setup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const zero = createZero();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} h-full font-sans antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <meta content="Done" name="apple-mobile-web-app-title" />
      <body className="h-full bg-background">
        <ZeroProvider zero={zero}>
          <RootStoreProvider>{children}</RootStoreProvider>
        </ZeroProvider>

        <Toaster closeButton duration={2000} position="bottom-right" />
      </body>
    </html>
  );
}
