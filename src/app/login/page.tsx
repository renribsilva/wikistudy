"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/lib/auth/actions";
import styles from "./login.module.css";
import { PasswordInput } from "@/components/tsx/password-input";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className={styles.login_wrapper}>
      <div className={styles.login_card}>
        <h1 className={styles.login_title}>Entrar</h1>

        <form action={action} className={styles.login_form}>
          <div className={styles.field_group}>
            <label htmlFor="email" className={styles.field_label}>
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
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
              autoComplete="current-password"
              wrapperClassName={styles.password_wrapper}
              inputClassName={`${styles.field_input} ${styles.password_input}`}
              toggleClassName={styles.password_toggle}
            />
            {state?.errors?.password && (
              <p className={styles.field_error}>{state.errors.password[0]}</p>
            )}
            <Link href="/forgot-password" className={styles.forgot_link}>
              Esqueceu a senha?
            </Link>
          </div>

          {state?.message && (
            <p className={styles.form_alert}>{state.message}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className={styles.submit_button}
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className={styles.legal_notice}>
          Ao continuar, concordas com os nossos{" "}
          <Link href="/tos" className={styles.legal_link}>
            Termos de Serviço
          </Link>
          ,{" "}
          <Link href="/privacy" className={styles.legal_link}>
            Política de Privacidade
          </Link>{" "}
          e{" "}
          <Link href="/cookies" className={styles.legal_link}>
            Uso de cookies
          </Link>
          .
        </p>
        <p className={styles.signup_prompt}>
          Ainda não tem conta? <Link href="/signup">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
