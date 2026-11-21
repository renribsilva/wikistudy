import { getUser } from "@/app/lib/dal";
import { getProfileDTO } from "@/app/lib/dto";

export default async function DashboardPage() {
  // 1. DAL garante sessão válida e retorna o usuário logado
  const currentUser = await getUser();
  if (!currentUser) return null;

  // 2. DTO aplica as regras de visibilidade para esse usuário
  const profile = await getProfileDTO(currentUser.id);
  if (!profile) return null;

  return (
    <div>
      <h1>Bem-vindo, {profile.name}</h1>
      {profile.email && <p>{profile.email}</p>}
    </div>
  );
}
