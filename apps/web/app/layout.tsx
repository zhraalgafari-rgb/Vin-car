import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SupabaseProvider } from "@/components/layout/supabase-provider";
import "./globals.css";
import "./rtl.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AutoParts KMS",
  description: "AI-powered Automotive Parts Knowledge Management Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
