"use client";

import type { ReactNode } from "react";

type SubmitButtonProps = {
  pending?: boolean;
  label?: string;
  pendingLabel?: string;
  className?: string;
  children?: ReactNode;
};

export default function SubmitButton({
  pending = false,
  label = "Entrar",
  pendingLabel = "Entrando...",
  className,
  children,
}: SubmitButtonProps) {
  return (
    <button type="submit" disabled={pending} className={className}>
      {children ?? (pending ? pendingLabel : label)}
    </button>
  );
}
