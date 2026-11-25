"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { signup } from "@/app/lib/auth/actions";
import styles from "./components.module.css";
import { PasswordInput } from "./password-input";
import GoogleSignInButton from "@/components/tsx/buttons/google-button";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_denied: "O login com Google foi cancelado.",
  invalid_state:
    "Sessão de autenticação expirada ou inválida. Tente novamente.",
  oauth_config: "Configuração do login com Google incompleta no servidor.",
  token_exchange: "Falha ao concluir a autenticação com o Google.",
  unverified_email: "A conta Google precisa ter o e-mail verificado.",
};

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");
  const oauthErrorMessage = oauthError
    ? (OAUTH_ERROR_MESSAGES[oauthError] ??
      "Não foi possível entrar com o Google.")
    : null;

  return (
    <div className={styles.signup_container}>
      {oauthErrorMessage && (
        <p role="alert" className={styles.form_alert}>
          {oauthErrorMessage}
        </p>
      )}

      <GoogleSignInButton style={{ width: "400px", maxWidth: "100%" }} />

      <div className={styles.oauth_divider}>
        <span>ou</span>
      </div>

      <form action={action} className={styles.signup_form}>
        <div className={styles.field_group}>
          <label htmlFor="name" className={styles.field_label}>
            Nome
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Seu nome"
            className={styles.field_input}
          />
          {state?.errors?.name && (
            <p className={styles.field_error}>{state.errors.name[0]}</p>
          )}
        </div>

        <div className={styles.field_group}>
          <label htmlFor="email" className={styles.field_label}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className={styles.field_input}
          />
          {state?.errors?.email && (
            <p className={styles.field_error}>{state.errors.email[0]}</p>
          )}
        </div>

        <div className={styles.field_group}>
          <label htmlFor="password" className={styles.field_label}>
            Senha
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            wrapperClassName={styles.password_wrapper}
            inputClassName={`${styles.field_input} ${styles.password_input}`}
            toggleClassName={styles.password_toggle}
          />
          {state?.errors?.password && (
            <div className={styles.password_errors}>
              <p>A senha deve:</p>
              <ul>
                {state.errors.password.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {state?.message && <p className={styles.form_alert}>{state.message}</p>}

        <button
          disabled={pending}
          type="submit"
          className={styles.submit_button}
        >
          {pending ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
