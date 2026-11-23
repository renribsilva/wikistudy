import { getOptionalUser } from "@/app/identity/authorization/dal";

export default async function DashboardPage() {
  const user = await getOptionalUser();

  return (
    <section className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">WikiStudy</h1>
        <p className="text-sm text-gray-600">
          {user
            ? `Bem-vindo de volta, ${user.name}!`
            : "Explore o WikiStudy como visitante ou entre para personalizar sua experiência."}
        </p>
      </div>

      {user ? (
        <div className="border rounded p-4 space-y-2">
          <h2 className="text-lg font-medium">Seu espaço personalizado</h2>
          <p className="text-sm">Nome: {user.name}</p>
          {user.email && <p className="text-sm">E-mail: {user.email}</p>}
        </div>
      ) : (
        <div className="border rounded p-4 space-y-2">
          <h2 className="text-lg font-medium">Visão geral do Wiki</h2>
          <p className="text-sm text-gray-600">
            Conteúdo público disponível para leitura. Faça login para salvar e
            acessar suas personalizações.
          </p>
        </div>
      )}
    </section>
  );
}
