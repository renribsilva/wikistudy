"use client";

import LegalNav from "@/components/tsx/legal/legal-nav";
import PrivacyPolicy, {
  buildPrivacyItems,
} from "@/components/tsx/legal/privacy-policy";
import styles from "./privacy.module.css";
import { useSidebar } from "@/providers/sidebar-provider";
import Footer from "@/components/tsx/footer";

export default function PrivacyPage() {
  const privacyProps = {
    lastUpdated: "24/11/2026",
    maintainerName: "Equipe WikiStudy",
    contactEmail: "ren.rib.silva@gmail.com",
    officialUrl: "https://wikistudy.vercel.app",
    tosUrl: "/tos",
    cookiesUrl: "/cookies",
  };

  const navItems = buildPrivacyItems(privacyProps);
  const { isMobile } = useSidebar();

  return (
    <>
      <div className={styles.privacy_page}>
        {!isMobile && (
          <div className={styles.privacy_page_nav}>
            <LegalNav items={navItems} />
          </div>
        )}
        <div className={styles.privacy_page_content}>
          <div className={styles.privacy_page_contentInner}>
            <PrivacyPolicy {...privacyProps} />
          </div>
        </div>
      </div>
      {isMobile && <Footer showHome showTheme />}
    </>
  );
}
