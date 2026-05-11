import { apiRequest } from "api/request";
import type { Profile } from "types/conduit";

export async function getProfile(username: string, token?: string | null): Promise<Profile> {
  const path = `/profiles/${encodeURIComponent(username)}`;
  const data = await apiRequest<{ profile: Profile }>(path, { token });
  return data.profile;
}