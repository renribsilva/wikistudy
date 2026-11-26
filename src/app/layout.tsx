import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { Plus_Jakarta_Sans } from "next/font/google";
import { OPTIONAL_THEMES } from "./lib/themes/themes-config";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://wikistudy.vercel.app");

const OG_IMAGE_URL = `${SITE_URL}/api/og`;

export async function generateMetadata(): Promise<Metadata> {
  const title = "WikiStudy — Plataforma de Estudo, Organização e Cronograma";
  const description =
    "Plataforma de estudo, organização e cronograma com organização de links de vídeos gratuitos do YouTube.";

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    icons: {
      icon: "data:;base64,iVBORw0KGgo=",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_URL],
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: SITE_URL,
      siteName: "WikiStudy",
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: "WikiStudy — Plataforma de estudo, organização e cronograma com vídeos gratuitos do YouTube.",
        },
      ],
    },
  };
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={plusJakartaSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          themes={["system", "light", "dark", ...OPTIONAL_THEMES]}
          disableTransitionOnChange
        >
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;
