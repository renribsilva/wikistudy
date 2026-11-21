import "server-only";
import { eq } from "drizzle-orm";
import { getUser } from "@/app/lib/dal";
import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";

type Viewer = NonNullable<Awaited<ReturnType<typeof getUser>>>;

function canSeeName(viewer: Viewer) {
  return Boolean(viewer.id);
}

function canSeeEmail(viewer: Viewer, profileUserId: number) {
  return viewer.id === profileUserId;
}

export async function getProfileDTO(targetUserId: number) {
  const currentUser = await getUser();
  if (!currentUser) return null;
  if (currentUser.id !== targetUserId) return null;
  const data = await db.query.users.findMany({
    where: eq(users.id, targetUserId),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  });

  const profile = data[0];
  if (!profile) return null;
  return {
    id: profile.id,
    name: canSeeName(currentUser) ? profile.name : null,
    email: canSeeEmail(currentUser, profile.id) ? profile.email : null,
  };
}
