import { getOptionalUser } from "@/app/lib/authorization/dal";

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
    </section>
  );
}
