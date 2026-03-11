import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // <-- 1. L'import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zcare - Suivi Médical",
  description: "Plateforme de suivi de santé pour étudiants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* <-- 2. Le distributeur d'alertes avec un beau design --> */}
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              padding: '16px',
              color: '#1f2937',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#fff' },
            },
            error: {
              style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' },
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}