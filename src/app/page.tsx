import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-semibold">Bem-vindo</h1>
      <div className="flex gap-3">
        <Link href="/login" className="border rounded px-4 py-2">
          Entrar
        </Link>
        <Link href="/signup" className="border rounded px-4 py-2">
          Criar conta
        </Link>
      </div>
    </main>
  );
}
