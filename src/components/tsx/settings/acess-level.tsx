import Link from "next/link";
import type { UserRole } from "@/app/lib/database/schema";
import styles from "./settings.module.css";

interface AccessLevelCardProps {
  role: UserRole;
}

const ROLE_META: Record<
  UserRole,
  {
    label: string;
    code: string;
    description: string;
  }
> = {
  user: {
    label: "Usuário padrão",
    code: "user",
    description:
      "Acesso básico à conta e às preferências do WikiStudy. Vincule uma conta do MediaWiki para se tornar colaborador.",
  },
  colab: {
    label: "Colaborador",
    code: "colab",
    description:
      "Conta vinculada ao MediaWiki com permissão para editar o conteúdo do WikiStudy.",
  },
  admin: {
    label: "Administrador",
    code: "admin",
    description:
      "Acesso administrativo completo ao sistema e às áreas de gestão e colaboração.",
  },
};

export function AccessLevelCard({ role }: AccessLevelCardProps) {
  const meta = ROLE_META[role] ?? {
    label: "Nível não identificado",
    code: String(role),
    description: "Nível de acesso atual associado à sua conta.",
  };

  const showColabLink = role === "user" || role === "colab";
  const colabButtonLabel =
    role === "colab" ? "Verificar conta na WikiStudy" : "Seja um colaborador";

  return (
    <section aria-label="Nível de acesso" className={styles.role_card}>
      <h2 className={styles.role_heading}>Nível de acesso</h2>
      <p className={styles.role_description}>
        <strong>{meta.label}:</strong> {meta.description}
      </p>

      {showColabLink && (
        <div className={styles.role_actions}>
          <Link href="/dashboard/account/colab" className={styles.role_button}>
            {colabButtonLabel}
          </Link>
        </div>
      )}
    </section>
  );
}
