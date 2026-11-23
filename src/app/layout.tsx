import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WikiStudy",
  description: "WikiStudy — Plataforma de estudos para vestibulandos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
