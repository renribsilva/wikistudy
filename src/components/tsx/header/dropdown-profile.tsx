"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import { logout } from "@/app/lib/session/actions";
import Link from "next/link";
import { useSidebar } from "@/providers/sidebar-provider";
import { AvatarFace } from "../settings/face-index";
import Settings from "@/components/svg/settings";
import Logout from "@/components/svg/logout";
import Home from "@/components/svg/home";
import Theme from "../buttons/theme-button";
import GoogleSignInButton from "../buttons/google-button";

interface DropdownProfileProps {
  isAuthenticated?: boolean;
  userName?: string | null;
  userEmail?: string | null;
  avatarFace?: number | string | null;
}

function DropdownProfile({
  isAuthenticated = false,
  userName,
  userEmail,
  avatarFace,
}: DropdownProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isMobile, isMobileOpen, toggleHeaderSidebar } = useSidebar();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleToggleDropdown = () => {
    if (isMobileOpen) {
      toggleHeaderSidebar();
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.dropdown_container} ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Abrir menu do perfil"
        onClick={handleToggleDropdown}
        className={styles.dropdown_face}
      >
        <AvatarFace faceId={isAuthenticated ? avatarFace : undefined} />
      </button>

      {isOpen && (
        <div className={styles.dropdown_list} role="menu">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard/account/settings"
                className={`${styles.dropdown_list_button} ${styles.dropdown_profile_button}`}
                onClick={() => setIsOpen(false)}
              >
                <div>
                  {userName && (
                    <div className={styles.dropdown_list_user}>{userName}</div>
                  )}
                  {userEmail && (
                    <div className={styles.dropdown_list_email}>
                      {userEmail}
                    </div>
                  )}
                </div>
                <div className={styles.dropdown_list_icon}>
                  <Settings width="20px" height="20px" />
                </div>
              </Link>
              <hr className={styles.dropdown_divider} />
              <div className={styles.dropdown_body}>
                <Link
                  href="/"
                  className={styles.dropdown_list_button}
                  onClick={() => setIsOpen(false)}
                >
                  <div>Home</div>
                  <div className={styles.dropdown_list_icon}>
                    <Home width="20px" height="20px" />
                  </div>
                </Link>
                {isMobile && (
                  <div className={styles.dropdown_list_button}>
                    <div>Tema</div>
                    <div>
                      <Theme compact />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.dropdown_footer_group}>
                <hr className={styles.dropdown_divider} />
                <form action={logout} className={styles.dropdown_logout_form}>
                  <button type="submit" className={styles.dropdown_list_button}>
                    <div>Sair</div>
                    <div className={styles.dropdown_list_icon}>
                      <Logout width="20px" height="20px" />
                    </div>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className={styles.dropdown_auth_actions}>
                <GoogleSignInButton
                  className={styles.dropdown_google_button}
                  onClick={() => setIsOpen(false)}
                />
                <Link
                  href="/login"
                  className={styles.dropdown_auth_login}
                  onClick={() => setIsOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/signup"
                  className={styles.dropdown_auth_signup}
                  onClick={() => setIsOpen(false)}
                >
                  Criar conta
                </Link>
              </div>
              {isMobile && (
                <div
                  className={`${styles.dropdown_body} ${styles.dropdown_theme_footer}`}
                >
                  <hr className={styles.dropdown_divider} />
                  <div className={styles.dropdown_list_button}>
                    <div>Tema</div>
                    <div>
                      <Theme compact />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DropdownProfile;
