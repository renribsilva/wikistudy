"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "./buttons.module.css";

type DisconnectWikiAccountButtonProps = {
  mwUsername: string;
};

export function DisconnectWikiAccountButton({
  mwUsername,
}: DisconnectWikiAccountButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleDisconnect() {
    setError(null);

    try {
      const res = await fetch("/api/mediawiki/unlink-account", {
        method: "POST",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data?.error ?? "Não foi possível desvincular a conta MediaWiki.",
        );
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch {
      setError("Falha de comunicação ao desvincular a conta MediaWiki.");
    }
  }

  return (
    <div className={styles.unlink_wrapper}>
      <button
        type="button"
        onClick={handleDisconnect}
        disabled={isPending}
        className={styles.unlink_btn}
      >
        {isPending
          ? "Desvinculando..."
          : `Desvincular conta MediaWiki (${mwUsername})`}
      </button>

      {error && (
        <p role="alert" className={styles.unlink_error}>
          {error}
        </p>
      )}
    </div>
  );
}
