"use client";

import LegalNav from "@/components/tsx/legal/legal-nav";
import styles from "./cookie.module.css";
import CookiePolicy, {
  buildCookiesItems,
} from "@/components/tsx/legal/cookies-policy";
import { useSidebar } from "@/providers/sidebar-provider";
import Footer from "@/components/tsx/footer";

export default function PrivacyPage() {
  const cookieProps = {
    lastUpdated: "24/11/2026",
    maintainerName: "Equipe WikiStudy",
    contactEmail: "ren.rib.silva@gmail.com",
    officialUrl: "https://wikistudy.vercel.app",
    tosUrl: "/tos",
    cookiesUrl: "/cookies",
  };

  const navItems = buildCookiesItems(cookieProps);
  const { isMobile } = useSidebar();

  return (
    <>
      <div className={styles.cookie_page}>
        {!isMobile && (
          <div className={styles.cookie_page_nav}>
            <LegalNav items={navItems} />
          </div>
        )}
        <div className={styles.cookie_page_content}>
          <div className={styles.cookie_page_contentInner}>
            <CookiePolicy {...cookieProps} />
          </div>
        </div>
      </div>
      {isMobile && <Footer showHome showTheme />}
    </>
  );
}
