import Link from "next/link";
import { verifySession } from "@/app/identity/authorization/dal";
import { logout } from "@/app/identity/session/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-3 flex items-center justify-between">
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="font-semibold">
            WikiStudy
          </Link>
        </nav>

        <form action={logout}>
          <button
            type="submit"
            className="text-sm px-3 py-1.5 rounded border hover:bg-neutral-100 cursor-pointer"
          >
            Sair
          </button>
        </form>
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
