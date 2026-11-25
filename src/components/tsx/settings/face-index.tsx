import Face1 from "@/components/svg/faces/face1";
import Face2 from "@/components/svg/faces/face2";
import Face3 from "@/components/svg/faces/face3";
import Face4 from "@/components/svg/faces/face4";
import Face5 from "@/components/svg/faces/face5";
import Face6 from "@/components/svg/faces/face6";

export const AVATAR_FACES = {
  1: Face1,
  2: Face2,
  3: Face3,
  4: Face4,
  5: Face5,
  6: Face6,
} as const;

export type AvatarFaceId = keyof typeof AVATAR_FACES;

export function normalizeAvatarFaceId(faceId: unknown): AvatarFaceId {
  const numericFace =
    typeof faceId === "number" || typeof faceId === "string"
      ? Number(faceId)
      : NaN;

  if (Number.isInteger(numericFace) && numericFace >= 1 && numericFace <= 6) {
    return numericFace as AvatarFaceId;
  }

  return 1;
}

export function AvatarFace({
  faceId = 1,
  width = "24px",
  height = "24px",
}: {
  faceId?: number | string | null;
  width?: string;
  height?: string;
}) {
  const safeId = normalizeAvatarFaceId(faceId);
  const Icon = AVATAR_FACES[safeId];
  return <Icon width={width} height={height} />;
}
