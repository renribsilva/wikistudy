import { verifySession } from "@/app/identity/authorization/dal";
import { getProfileDTO } from "@/app/identity/authorization/dto";

export default async function DashboardPage() {
  // Deduplicado por request via React cache() em verifySession / getUser
  const session = await verifySession();
  const profile = await getProfileDTO(session.userId);

  if (!profile) return null;

  return (
    <div>
      <h1>Bem-vindo, {profile.name}</h1>
      {profile.email && <p>{profile.email}</p>}
    </div>
  );
}
