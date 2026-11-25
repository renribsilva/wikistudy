"use client";

import { useActionState } from "react";
import { signup } from "@/app/lib/auth/actions";
import styles from "./components.module.css";
import { PasswordInput } from "./password-input";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
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

      <button disabled={pending} type="submit" className={styles.submit_button}>
        {pending ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}
