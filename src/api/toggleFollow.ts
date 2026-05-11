import { apiRequest } from "api/request";
import type { Profile } from "types/conduit";

export async function followUser(username: string, token: string): Promise<Profile> {
  const path = `/profiles/${encodeURIComponent(username)}/follow`;
  const data = await apiRequest<{ profile: Profile }>(path, {
    method: "POST",
    token,
  });
  return data.profile;
}

export async function unfollowUser(username: string, token: string): Promise<Profile> {
  const path = `/profiles/${encodeURIComponent(username)}/follow`;
  const data = await apiRequest<{ profile: Profile }>(path, {
    method: "DELETE",
    token,
  });
  return data.profile;
}