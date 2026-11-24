"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./components.module.css";
import Profile from "../svg/profile";
import { logout } from "@/app/lib/session/actions";

interface DropdownProfileProps {
  userName?: string | null;
  userEmail?: string | null;
}

function DropdownProfile({ userName, userEmail }: DropdownProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div
      className={styles.dropdown_container}
      ref={dropdownRef}
      style={{ position: "relative", display: "inline-flex" }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Abrir menu do perfil"
        onClick={() => setIsOpen((prev) => !prev)}
        className={styles.dropdown_button}
        style={{ cursor: "pointer" }}
      >
        <Profile />
      </button>

      {isOpen && (
        <div
          className={styles.dropdown_list_sidebar}
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            width: "max-content",
            minWidth: "180px",
            maxWidth: "260px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            padding: "10px 12px",
            zIndex: 50,
          }}
        >
          {userName && (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              {userName}
            </div>
          )}

          {userEmail && (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                opacity: 0.75,
              }}
            >
              {userEmail}
            </div>
          )}

          <form action={logout} style={{ display: "flex", marginTop: "4px" }}>
            <button
              type="submit"
              style={{ cursor: "pointer", whiteSpace: "nowrap" }}
            >
              Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default DropdownProfile;
