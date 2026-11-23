import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WikiStudy",
  description: "WikiStudy — Sistema de autenticação e estudos",
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
