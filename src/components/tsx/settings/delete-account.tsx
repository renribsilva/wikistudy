"use client";

import { useState } from "react";
import styles from "./settings.module.css";

interface DeleteAccountCardProps {
  onDelete?: () => Promise<{ ok: boolean; error?: string } | void> | void;
}

export function DeleteAccountCard({ onDelete }: DeleteAccountCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleConfirmDelete() {
    setErrorMessage(null);
    if (!onDelete) return;

    setDeleting(true);
    try {
      const result = await onDelete();
      if (result && "ok" in result && !result.ok) {
        setErrorMessage(result.error ?? "Não foi possível excluir a conta.");
        setDeleting(false);
      }
    } catch {
      setErrorMessage("Erro ao excluir a conta. Tente novamente.");
      setDeleting(false);
    }
  }

  return (
    <section aria-label="Excluir conta" className={styles.delete_card}>
      <h2 className={styles.delete_heading}>Excluir conta</h2>
      <p className={styles.delete_description}>
        Essa ação remove sua conta permanentemente e encerra sua sessão.
      </p>

      {!confirming ? (
        <div className={styles.delete_actions}>
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              setErrorMessage(null);
              setConfirming(true);
            }}
            className={styles.delete_danger_button}
          >
            Excluir minha conta
          </button>
        </div>
      ) : (
        <div className={styles.delete_actions}>
          <button
            type="button"
            disabled={deleting}
            onClick={handleConfirmDelete}
            className={styles.delete_danger_button}
          >
            {deleting ? "Excluindo..." : "Confirmar exclusão definitiva"}
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => setConfirming(false)}
            className={styles.delete_secondary_button}
          >
            Cancelar
          </button>
        </div>
      )}

      {errorMessage && (
        <p role="alert" className={styles.delete_error}>
          {errorMessage}
        </p>
      )}
    </section>
  );
}
