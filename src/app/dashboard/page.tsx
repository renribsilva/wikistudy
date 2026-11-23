import Link from "next/link";
import { getOptionalUser } from "@/app/identity/authorization/dal";
import { logout } from "@/app/identity/session/session";

export default async function DashboardPage() {
  const user = await getOptionalUser();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-semibold">WikiStudy</h1>
          <p className="text-sm text-gray-600">
            {user
              ? `Bem-vindo de volta, ${user.name}!`
              : "Explore o dashboard e faça login para personalizar sua experiência."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <form action={logout}>
              <button
                type="submit"
                className="border rounded px-3 py-1.5 text-sm font-medium"
              >
                Sair
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                className="border rounded px-3 py-1.5 text-sm font-medium"
              >
                Entrar
              </Link>
              <Link
                href="/signup"
                className="border rounded px-3 py-1.5 text-sm font-medium"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>
      </header>

      {user ? (
        <section className="border rounded p-4 space-y-2">
          <h2 className="text-lg font-medium">Seu espaço personalizado</h2>
          <p className="text-sm">Nome: {user.name}</p>
          {user.email && <p className="text-sm">E-mail: {user.email}</p>}
        </section>
      ) : (
        <section className="border rounded p-4 space-y-2">
          <h2 className="text-lg font-medium">Visão geral</h2>
          <p className="text-sm text-gray-600">
            Você está navegando como visitante. Entre na sua conta para ver seus
            dados e preferências personalizadas.
          </p>
        </section>
      )}
    </main>
  );
}
