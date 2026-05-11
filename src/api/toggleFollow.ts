import { apiRequest } from "api/request";
import type { Profile } from "types/conduit";

/**
 * Follows a user and returns updated profile payload.
 */
export async function followUser(username: string, token: string): Promise<Profile> {
  const path = `/profiles/${encodeURIComponent(username)}/follow`;
  const data = await apiRequest<{ profile: Profile }>(path, {
    method: "POST",
    token,
  });
  return data.profile;
}

/**
 * Unfollows a user and returns updated profile payload.
 */
export async function unfollowUser(username: string, token: string): Promise<Profile> {
  const path = `/profiles/${encodeURIComponent(username)}/follow`;
  const data = await apiRequest<{ profile: Profile }>(path, {
    method: "DELETE",
    token,
  });
  return data.profile;
}