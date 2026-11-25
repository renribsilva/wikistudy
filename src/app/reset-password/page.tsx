"use client";

import { use, useActionState } from "react";
import Link from "next/link";
import { resetPassword } from "@/app/lib/auth/actions";
import type { FormState } from "@/app/lib/auth/definitions";
import { PasswordInput } from "@/components/tsx/password-input";
import styles from "./reset.module.css";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = use(searchParams);
  const [state, action, pending] = useActionState<FormState, FormData>(
    resetPassword,
    undefined,
  );

  return (
    <div className={styles.login_wrapper}>
      <div className={styles.login_card}>
        <h1 className={styles.login_title}>Redefinir senha</h1>
        <p className={styles.field_label}>Digite a sua nova senha.</p>

        <form action={action} className={styles.login_form}>
          <input type="hidden" name="token" value={token ?? ""} />

          <div className={styles.field_group}>
            <label htmlFor="password" className={styles.field_label}>
              Nova senha
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
              <div className={styles.field_error}>
                <p>A senha deve:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.field_group}>
            <label htmlFor="confirmPassword" className={styles.field_label}>
              Confirmar nova senha
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              wrapperClassName={styles.password_wrapper}
              inputClassName={`${styles.field_input} ${styles.password_input}`}
              toggleClassName={styles.password_toggle}
            />
            {state?.errors?.confirmPassword && (
              <p className={styles.field_error}>
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {state?.errors?.token && (
            <p className={styles.form_alert}>{state.errors.token[0]}</p>
          )}

          {state?.message && (
            <p className={styles.form_alert}>{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className={styles.submit_button}
          >
            {pending ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>

        <p className={styles.signup_prompt}>
          Voltar para <Link href="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
