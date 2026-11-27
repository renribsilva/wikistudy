import "server-only";
import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY não configurada.");
  }
  return new Resend(apiKey);
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}): Promise<void> {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM?.trim() || "onboarding@resend.dev";

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: "Redefinição de senha",
    html: `
      <p>Você solicitou a redefinição da sua senha.</p>
      <p><a href="${resetUrl}">Clique aqui para redefinir sua senha</a> (válido por 30 minutos).</p>
      <p>Se você não fez esta solicitação, ignore este e-mail.</p>
    `,
  });

  if (error) {
    throw new Error(`Falha ao enviar e-mail via Resend: ${error.message}`);
  }
}
