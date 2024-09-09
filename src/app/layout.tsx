"use client";

import "./globals.css";
import StoreProvider from "./StoreProvider";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BarChartIcon } from "lucide-react";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <StoreProvider>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-gray-100 p-4 sm:static sm:h-auto sm:border-0 sm:px-6 text-primary-foreground bg-primary">
            <Link
              href="#"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <BarChartIcon className="h-6 w-6" />
              <span className="text-lg">Chart Craft</span>
            </Link>
          </header>
          <div className="p-4 text-foreground">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}
