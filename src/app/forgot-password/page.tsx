"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/lib/auth/actions";
import type { FormState } from "@/app/lib/auth/definitions";
import styles from "./forgot.module.css";

export default function ForgotPasswordPage() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    requestPasswordReset,
    undefined,
  );

  return (
    <div className={styles.login_wrapper}>
      <div className={styles.login_card}>
        <h1 className={styles.login_title}>Esqueceu a senha?</h1>
        <p className={styles.field_label}>
          Digite seu e-mail para receber o link de redefinição.
        </p>

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

          {state?.message && (
            <p className={styles.form_notice}>{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className={styles.submit_button}
          >
            {pending ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        <p className={styles.signup_prompt}>
          Lembrou a senha? <Link href="/login">Voltar para entrar</Link>
        </p>
      </div>
    </div>
  );
}
