import Link from "next/link";
import styles from "./components.module.css";
import HomeButton from "./buttons/home-button";
import Theme from "./buttons/theme-button";

interface FooterProps {
  brandName?: string;
  termsHref?: string;
  privacyHref?: string;
  cookiesHref?: string;
  showHome?: boolean;
  showTheme?: boolean;
}

export function Footer({
  brandName = "WikiStudy",
  termsHref = "/tos",
  privacyHref = "/privacy",
  cookiesHref = "/cookies",
  showHome = false,
  showTheme = false,
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const hasActions = showHome || showTheme;

  return (
    <footer
      className={styles.footer_container}
      aria-label="Rodapé institucional"
    >
      {hasActions && (
        <div className={styles.home_theme_row}>
          {showHome && <HomeButton />}
          {showTheme && <Theme />}
        </div>
      )}
      <div className={styles.footer_inner}>
        <p className={styles.footer_meta}>
          <span>
            © {currentYear} {brandName}
          </span>
          <span className={styles.footer_sep} aria-hidden="true">
            |
          </span>
          <span>Licença GNU GPL v3</span>
        </p>

        <nav className={styles.footer_nav} aria-label="Links legais">
          <ul className={styles.footer_links}>
            <li>
              <Link href={termsHref} className={styles.footer_link}>
                Termos
              </Link>
            </li>
            <li className={styles.footer_sep} aria-hidden="true">
              |
            </li>
            <li>
              <Link href={privacyHref} className={styles.footer_link}>
                Privacidade
              </Link>
            </li>
            <li className={styles.footer_sep} aria-hidden="true">
              |
            </li>
            <li>
              <Link href={cookiesHref} className={styles.footer_link}>
                Uso de cookies
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
