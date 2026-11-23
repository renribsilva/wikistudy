import Link from "next/link";
import { getOptionalUser } from "@/app/lib/authorization/dal";
import { logout } from "@/app/lib/session/actions";

const WIKI_PALETTE = {
  bg: "#0d0d0d",
  surface: "#141414",
  border: "#262626",
  textPrimary: "#fafafa",
  textSecondary: "#a3a3a3",
  textMuted: "#737373",
  orange: "#f97316",
  purple: "#8b5cf6",
  blue: "#3284eb",
  green: "#22c55e",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalUser();

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundColor: WIKI_PALETTE.bg,
        color: WIKI_PALETTE.textPrimary,
      }}
    >
      {/* Faixa lateral */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 w-1.5 h-full z-30 flex flex-col"
      >
        <div
          className="flex-1"
          style={{ backgroundColor: WIKI_PALETTE.orange }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: WIKI_PALETTE.purple }}
        />
        <div
          className="flex-1"
          style={{ backgroundColor: WIKI_PALETTE.blue }}
        />
      </div>

      <header
        className="sticky top-0 z-20 backdrop-blur-sm pl-7 pr-6 py-3.5 flex items-center justify-between border-b"
        style={{
          backgroundColor: "rgba(13, 13, 13, 0.95)",
          borderColor: WIKI_PALETTE.border,
        }}
      >
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 font-black tracking-tighter text-lg"
            style={{ color: WIKI_PALETTE.textPrimary }}
          >
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block w-2 h-2"
                style={{ backgroundColor: WIKI_PALETTE.orange }}
              />
              <span
                className="inline-block w-2 h-2"
                style={{ backgroundColor: WIKI_PALETTE.purple }}
              />
              <span
                className="inline-block w-2 h-2"
                style={{ backgroundColor: WIKI_PALETTE.green }}
              />
            </span>
            <span>wikistudy</span>
          </Link>

          <span
            className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-[0.22em]"
            style={{ color: WIKI_PALETTE.textMuted }}
          >
            Estudo • Organização • Cronograma
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span
                className="hidden md:inline text-xs"
                style={{ color: WIKI_PALETTE.textSecondary }}
              >
                {user.name}
              </span>

              <form action={logout}>
                <button
                  type="submit"
                  className="text-xs font-bold uppercase tracking-[0.14em] px-3.5 py-2 border transition cursor-pointer"
                  style={{
                    backgroundColor: WIKI_PALETTE.surface,
                    borderColor: WIKI_PALETTE.border,
                    color: WIKI_PALETTE.textPrimary,
                  }}
                >
                  Sair
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-bold uppercase tracking-[0.14em] px-3.5 py-2 border transition"
                style={{
                  backgroundColor: WIKI_PALETTE.surface,
                  borderColor: WIKI_PALETTE.border,
                  color: WIKI_PALETTE.textPrimary,
                }}
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="text-xs font-bold uppercase tracking-[0.14em] px-3.5 py-2 transition"
                style={{
                  backgroundColor: WIKI_PALETTE.orange,
                  color: WIKI_PALETTE.bg,
                }}
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 pl-7 pr-6 py-8">{children}</main>

      <footer
        className="pl-7 pr-6 py-4 border-t flex items-center justify-between text-xs"
        style={{
          borderColor: WIKI_PALETTE.border,
          color: WIKI_PALETTE.textMuted,
        }}
      >
        <span className="uppercase tracking-[0.14em] font-semibold">
          wikistudy.com.br
        </span>
        <span
          className="uppercase tracking-[0.14em] font-bold"
          style={{ color: WIKI_PALETTE.green }}
        >
          Plataforma de Estudo, Organização e Cronograma
        </span>
      </footer>
    </div>
  );
}
