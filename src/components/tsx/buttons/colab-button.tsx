"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./buttons.module.css";

interface CreateWikiAccountButtonProps {
  initialMwUsername?: string | null;
  storedMwUsername?: string | null;
  canReactivate?: boolean;
}

type StepPhase =
  | "idle"
  | "waking_or_token"
  | "creating_account"
  | "syncing_session";

const PHASE_MESSAGES: Record<Exclude<StepPhase, "idle">, string> = {
  waking_or_token:
    "Conectando ao MediaWiki (se a instância no Render estiver dormindo, isso pode levar até 1 minuto)...",
  creating_account: "Criando e vinculando sua conta na WikiStudy...",
  syncing_session:
    "Salvando vínculo, atualizando permissões e sincronizando a página...",
};

function formatActiveOkMessage(username: string | null): string {
  return username ? `Conta ativa: ${username}` : "Conta ativa";
}

export function CreateWikiAccountButton({
  initialMwUsername = null,
  storedMwUsername = null,
  canReactivate = false,
}: CreateWikiAccountButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<StepPhase>("idle");
  const [mwUsername, setMwUsername] = useState<string | null>(
    initialMwUsername,
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(
    initialMwUsername ? formatActiveOkMessage(initialMwUsername) : null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const phaseTimersRef = useRef<number[]>([]);

  function clearPhaseTimers() {
    for (const id of phaseTimersRef.current) {
      window.clearTimeout(id);
    }
    phaseTimersRef.current = [];
  }

  useEffect(() => {
    return () => clearPhaseTimers();
  }, []);

  useEffect(() => {
    if (loading) return;

    setErrorMessage(null);
    if (initialMwUsername) {
      setMwUsername(initialMwUsername);
      setStatusMessage(formatActiveOkMessage(initialMwUsername));
    } else {
      setMwUsername(null);
      setStatusMessage(null);
    }
  }, [initialMwUsername, loading]);

  function startProgressMessages() {
    clearPhaseTimers();
    setPhase("waking_or_token");
    setStatusMessage(PHASE_MESSAGES.waking_or_token);

    const t1 = window.setTimeout(() => {
      setPhase("creating_account");
      setStatusMessage(PHASE_MESSAGES.creating_account);
    }, 3500);

    const t2 = window.setTimeout(() => {
      setPhase("syncing_session");
      setStatusMessage(PHASE_MESSAGES.syncing_session);
    }, 9000);

    phaseTimersRef.current = [t1, t2];
  }

  function resolveFriendlyError(status: number, rawError?: unknown): string {
    if (typeof rawError === "string" && rawError.trim().length > 0) {
      return rawError.trim();
    }
    if (status === 504) {
      return "O MediaWiki demorou demais para responder (tempo limite esgotado). Tente novamente em instantes.";
    }
    if (status === 502) {
      return "Falha de comunicação com o servidor do MediaWiki. Tente novamente.";
    }
    if (status === 401 || status === 403) {
      return "Sua sessão expirou ou não tem permissão. Faça login novamente.";
    }
    return "Não foi possível concluir a operação na WikiStudy.";
  }

  async function handleReactivate() {
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);
    setStatusMessage("Reativando acesso de colaborador...");

    try {
      const res = await fetch("/api/mediawiki/reactivate-account", {
        method: "POST",
        cache: "no-store",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.ok !== true) {
        setStatusMessage(null);
        setErrorMessage(
          resolveFriendlyError(
            res.status,
            typeof data?.error === "string" ? data.error : undefined,
          ),
        );
        return;
      }

      const nextUsername =
        typeof data?.mwUsername === "string" && data.mwUsername.trim()
          ? data.mwUsername.trim()
          : storedMwUsername;

      if (nextUsername) {
        setMwUsername(nextUsername);
      }
      setStatusMessage(formatActiveOkMessage(nextUsername));
      router.refresh();
    } catch {
      setStatusMessage(null);
      setErrorMessage(
        "Falha de rede ao conectar com o servidor. Verifique sua conexão e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateAccount() {
    if (loading) return;

    setLoading(true);
    setErrorMessage(null);
    startProgressMessages();

    try {
      const res = await fetch("/api/mediawiki/create-account", {
        method: "POST",
        cache: "no-store",
      });

      const rawText = await res.text();
      let data: Record<string, unknown> | null = null;

      try {
        const parsed: unknown = JSON.parse(rawText);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          data = parsed as Record<string, unknown>;
        }
      } catch {
        clearPhaseTimers();
        setPhase("idle");
        setStatusMessage(mwUsername ? formatActiveOkMessage(mwUsername) : null);
        setErrorMessage(
          `Resposta inesperada do servidor (HTTP ${res.status}). Tente novamente.`,
        );
        return;
      }

      const resolvedUsername: string | null =
        typeof data?.mwUsername === "string" && data.mwUsername.trim()
          ? data.mwUsername.trim()
          : typeof data?.username === "string" && data.username.trim()
            ? data.username.trim()
            : mwUsername;

      if (!res.ok || data?.ok !== true) {
        clearPhaseTimers();
        setPhase("idle");
        setStatusMessage(mwUsername ? formatActiveOkMessage(mwUsername) : null);
        setErrorMessage(resolveFriendlyError(res.status, data?.error));
        return;
      }

      setPhase("syncing_session");
      setStatusMessage(PHASE_MESSAGES.syncing_session);

      if (resolvedUsername) {
        setMwUsername(resolvedUsername);
      }
      setStatusMessage(formatActiveOkMessage(resolvedUsername));

      router.refresh();
    } catch {
      clearPhaseTimers();
      setPhase("idle");
      setStatusMessage(mwUsername ? formatActiveOkMessage(mwUsername) : null);
      setErrorMessage(
        "Falha de rede ao conectar com o servidor. Verifique sua conexão e tente novamente.",
      );
    } finally {
      clearPhaseTimers();
      setPhase("idle");
      setLoading(false);
    }
  }

  const buttonLabel = loading
    ? canReactivate
      ? "Reativando..."
      : phase === "waking_or_token"
        ? "Conectando à wiki..."
        : phase === "creating_account"
          ? "Criando conta..."
          : "Sincronizando..."
    : canReactivate
      ? storedMwUsername
        ? `Reativar conta (${storedMwUsername})`
        : "Reativar conta"
      : mwUsername
        ? "Verificar conta na MediaWiki"
        : "Criar conta na MediaWiki";

  return (
    <div className={styles.colab_button_wrapper}>
      <button
        type="button"
        onClick={canReactivate ? handleReactivate : handleCreateAccount}
        disabled={loading}
        aria-busy={loading}
        className={`${styles.colab_button_button} ${styles.submit_anim_button}`}
      >
        {loading && (
          <span className={styles.button_spinner} aria-hidden="true" />
        )}
        <span>{buttonLabel}</span>
      </button>

      {statusMessage && (
        <p role="status" className={styles.colab_button_status_success}>
          {statusMessage}
        </p>
      )}
      {errorMessage && (
        <p role="alert" className={styles.colab_button_status_error}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
