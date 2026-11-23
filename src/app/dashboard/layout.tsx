import Link from "next/link";
import { getOptionalUser } from "@/app/identity/authorization/dal";
import { logout } from "@/app/identity/session/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalUser();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="font-semibold">
            WikiStudy
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <form action={logout}>
              <button
                type="submit"
                className="text-sm px-3 py-1.5 rounded border hover:bg-neutral-100 cursor-pointer"
              >
                Sair
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded border hover:bg-neutral-100"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="text-sm px-3 py-1.5 rounded border hover:bg-neutral-100"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
