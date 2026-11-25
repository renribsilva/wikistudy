"use client";

import {
  AVATAR_FACES,
  AvatarFaceId,
  normalizeAvatarFaceId,
} from "@/components/tsx/settings/face-index";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./settings.module.css";

const DEFAULT_AVATAR_FACE: AvatarFaceId = 1;

interface FaceSelectorCardProps {
  initialFace?: number | string | null;
  defaultFace?: number | string | null;
  onSave?: (
    faceId: AvatarFaceId,
  ) => Promise<{ ok: boolean; error?: string } | void> | void;
}

function resolveDefaultFace(
  initialFace?: number | string | null,
  defaultFace?: number | string | null,
): AvatarFaceId {
  if (initialFace !== null && initialFace !== undefined && initialFace !== "") {
    return normalizeAvatarFaceId(initialFace);
  }
  if (defaultFace !== null && defaultFace !== undefined && defaultFace !== "") {
    return normalizeAvatarFaceId(defaultFace);
  }
  return DEFAULT_AVATAR_FACE;
}

export function FaceSelectorCard({
  initialFace,
  defaultFace = DEFAULT_AVATAR_FACE,
  onSave,
}: FaceSelectorCardProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<AvatarFaceId>(() =>
    resolveDefaultFace(initialFace, defaultFace),
  );
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSelect(id: AvatarFaceId) {
    const previous = selected;
    setSelected(id);
    setErrorMessage(null);

    if (!onSave) return;

    setSaving(true);
    try {
      const result = await onSave(id);
      if (result && "ok" in result && !result.ok) {
        setSelected(previous);
        setErrorMessage(result.error ?? "Não foi possível salvar a face.");
        return;
      }

      window.dispatchEvent(
        new CustomEvent("wikistudy:avatar-updated", {
          detail: { faceId: id },
        }),
      );
      router.refresh();
    } catch {
      setSelected(previous);
      setErrorMessage("Erro ao salvar a face. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-label="Ícone do perfil" className={styles.face_card}>
      <h2 className={styles.face_heading}>Ícone do perfil</h2>
      <p className={styles.face_description}>
        Escolha qual face aparece no menu do seu perfil.
      </p>

      <div className={styles.face_grid}>
        {(Object.keys(AVATAR_FACES) as unknown as AvatarFaceId[]).map(
          (rawKey) => {
            const numericId = normalizeAvatarFaceId(Number(rawKey));
            const FaceIcon = AVATAR_FACES[numericId];
            const active = selected === numericId;

            return (
              <button
                key={numericId}
                type="button"
                aria-pressed={active}
                aria-label={`Selecionar face ${numericId}`}
                disabled={saving}
                onClick={() => handleSelect(numericId)}
                className={`${styles.face_option} ${
                  active ? styles.face_option_active : ""
                }`}
              >
                <FaceIcon width="24px" height="24px" />
              </button>
            );
          },
        )}
      </div>

      {errorMessage && (
        <p role="alert" className={styles.face_error}>
          {errorMessage}
        </p>
      )}
    </section>
  );
}
