import { Suspense } from "react";
import Link from "next/link";
import SignupForm from "@/components/tsx/signup-form";
import styles from "./signup.module.css";

export default function SignupPage() {
  return (
    <div className={styles.signup_wrapper}>
      <div className={styles.signup_card}>
        <h1 className={styles.signup_title}>Criar conta</h1>
        <Suspense>
          <SignupForm />
        </Suspense>
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
        <p className={styles.login_prompt}>
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
