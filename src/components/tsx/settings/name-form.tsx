"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./settings.module.css";

interface NameFormCardProps {
  initialName?: string | null;
  onSave?: (name: string) => Promise<{
    ok: boolean;
    error?: string;
    name?: string | null;
  } | void> | void;
}

export function NameFormCard({ initialName = "", onSave }: NameFormCardProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName ?? "");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSavedMessage(null);

    if (!onSave) return;

    setSaving(true);
    try {
      const result = await onSave(name);
      if (result && "ok" in result && !result.ok) {
        setErrorMessage(result.error ?? "Não foi possível atualizar o nome.");
        return;
      }

      if (
        result &&
        "ok" in result &&
        result.ok &&
        typeof result.name === "string"
      ) {
        setName(result.name);
      }

      setSavedMessage("Nome atualizado.");
      router.refresh();
    } catch {
      setErrorMessage("Erro ao atualizar o nome. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-label="Nome de exibição" className={styles.name_card}>
      <h2 className={styles.name_heading}>Nome de exibição</h2>
      <p className={styles.name_description}>
        Escolha como seu nome aparece no perfil e no menu.
      </p>

      <form onSubmit={handleSubmit} className={styles.name_form}>
        <input
          id="display-name-input"
          type="text"
          value={name}
          maxLength={60}
          disabled={saving}
          onChange={(e) => {
            setName(e.target.value);
            if (savedMessage) setSavedMessage(null);
          }}
          placeholder="Seu nome"
          className={styles.name_input}
        />
        <button type="submit" disabled={saving} className={styles.name_button}>
          {saving ? "Salvando..." : "Salvar nome"}
        </button>
      </form>

      {savedMessage && <p className={styles.name_status}>{savedMessage}</p>}

      {errorMessage && (
        <p role="alert" className={styles.name_error}>
          {errorMessage}
        </p>
      )}
    </section>
  );
}
