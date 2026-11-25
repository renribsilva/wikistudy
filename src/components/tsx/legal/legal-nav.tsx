"use client";

import { useState } from "react";
import styles from "./legal.module.css";
import Theme from "../theme-button";

export interface LegalNavItem {
  id: string;
  label: string;
}

interface LegalNavProps {
  items: readonly LegalNavItem[];
  title?: string;
}

export function LegalNav({ items, title = "Nesta página" }: LegalNavProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  return (
    <nav aria-label={title} className={styles.legal_nav_container}>
      <div>
        <p className={styles.legal_nav_title}>{title}</p>
        <ul className={styles.legal_nav_ul}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className={styles.legal_nav_li}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  data-active={isActive ? "true" : undefined}
                  className={
                    isActive
                      ? `${styles.legal_nav_a} ${styles.legal_nav_a_active}`
                      : styles.legal_nav_a
                  }
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.legal_nav_theme}>
        <Theme />
      </div>
    </nav>
  );
}

export default LegalNav;
