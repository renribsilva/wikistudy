"use client";

import LegalNav from "@/components/tsx/legal/legal-nav";
import TermsOfService, {
  buildTosItems,
} from "@/components/tsx/legal/tos-policy";
import styles from "./tos.module.css";
import { useSidebar } from "@/providers/sidebar-provider";
import Footer from "@/components/tsx/footer";

export default function TosPage() {
  const tosProps = {
    lastUpdated: "24/11/2026",
    maintainerName: "Equipe WikiStudy",
    licenseName: "GNUv3",
    repoUrl: "https://github.com/renribsilva/wikistudy",
    authProviders: "e-mail e senha",
    contactEmail: "ren.rib.silva@gmail.com",
    privacyUrl: "/privacy",
    jurisdiction: "São Paulo/SP",
    officialUrl: "https://wikistudy.vercel.app",
  };

  const navItems = buildTosItems(tosProps);
  const { isMobile } = useSidebar();

  return (
    <div className={styles.tos_wrapper}>
      <div className={styles.tos_page}>
        {!isMobile && (
          <aside className={styles.tos_page_nav}>
            <LegalNav items={navItems} />
          </aside>
        )}
        <main className={styles.tos_page_content}>
          <div className={styles.tos_page_contentInner}>
            <TermsOfService {...tosProps} />
          </div>
        </main>
      </div>
      {isMobile && <Footer showHome showTheme />}
    </div>
  );
}
