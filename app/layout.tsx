import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/ThemeProvider"; // <-- 1. L'import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zcare - Suivi Médical",
  description: "Plateforme de suivi de santé",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // On ajoute suppressHydrationWarning pour éviter une petite erreur Next.js liée au thème
    <html lang="fr" suppressHydrationWarning> 
      <body className={inter.className}>
        <ThemeProvider> {/* <-- 2. On enveloppe l'application */}
          <Toaster position="top-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}