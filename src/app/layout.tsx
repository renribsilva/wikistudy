import "./globals.css";
import { Ubuntu } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/context/sidebar-context";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  preload: false,
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://wikistudy.com.br"),
    title: "WikiStudy — Seu Mapa de Aulas Grátis & Cronograma",
    description:
      "Monte seu ritmo, organize aulas abertas do YouTube sem perder o fio da meada e mantenha seu cronograma sob controle.",
    icons: {
      icon: "data:;base64,iVBORw0KGgo=",
    },
    twitter: {
      card: "summary_large_image",
      title: "WikiStudy — Seu Mapa de Aulas Grátis & Cronograma",
      description:
        "Monte seu ritmo, organize aulas abertas do YouTube sem perder o fio da meada e mantenha seu cronograma sob controle.",
      images: ["/api/og"],
    },
    openGraph: {
      title: "WikiStudy — Seu Mapa de Aulas Grátis & Cronograma",
      description:
        "Monte seu ritmo, organize aulas abertas do YouTube sem perder o fio da meada e mantenha seu cronograma sob controle.",
      type: "website",
      url: "https://wikistudy.com.br",
      siteName: "WikiStudy",
      images: [
        {
          url: "/api/og",
          width: 1200,
          height: 630,
          alt: "WikiStudy — Aulas gratuitas do YouTube, cronograma e foco no que importa.",
        },
      ],
    },
  };
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
