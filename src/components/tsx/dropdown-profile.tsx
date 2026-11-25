"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./components.module.css";
import { logout } from "@/app/lib/session/actions";
import Logout from "../svg/logout";
import Settings from "../svg/settings";
import Link from "next/link";
import { useSidebar } from "@/context/sidebar-context";
import Theme from "./theme-button";
import { AvatarFace } from "./settings/face-index";

interface DropdownProfileProps {
  userName?: string | null;
  userEmail?: string | null;
  avatarFace?: number | string | null;
}

function DropdownProfile({
  userName,
  userEmail,
  avatarFace,
}: DropdownProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useSidebar();

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

  return (
    <div className={styles.dropdown_container} ref={dropdownRef}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Abrir menu do perfil"
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.dropdown_face}
      >
        <AvatarFace faceId={avatarFace} />
      </button>{" "}
      {isOpen && (
        <div className={styles.dropdown_list} role="menu">
          <Link
            href="/account/settings"
            className={styles.dropdown_list_button}
            onClick={() => setIsOpen(false)}
          >
            <div>
              {userName && (
                <div className={styles.dropdown_list_user}>{userName}</div>
              )}
              {userEmail && (
                <div className={styles.dropdown_list_email}>{userEmail}</div>
              )}
            </div>
            <div className={styles.dropdown_list_icon}>
              <Settings width="20px" height="20px" />
            </div>
          </Link>
          <hr className={styles.dropdown_divider} />
          <div className={styles.dropdown_body}>
            <div className={styles.dropdown_list_button}>
              {isMobile && (
                <>
                  <div>Tema</div>
                  <div>
                    <Theme />
                  </div>
                </>
              )}
            </div>
          </div>
          <hr className={styles.dropdown_divider} />
          <div>
            <form action={logout} className={styles.dropdown_logout_form}>
              <button type="submit" className={styles.dropdown_list_button}>
                <div>Sair</div>
                <div className={styles.dropdown_list_icon}>
                  <Logout width="20px" height="20px" />
                </div>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownProfile;
