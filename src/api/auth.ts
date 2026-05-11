import { apiRequest } from "api/request";
import type { User } from "types/conduit";

export async function loginUser(email: string, password: string): Promise<User> {
  const json = await apiRequest<{ user: User }>("/users/login", {
    method: "POST",
    body: { user: { email, password } },
  });
  return json.user;
}

export async function fetchCurrentUser(token: string): Promise<User> {
  const json = await apiRequest<{ user: User }>("/user", { token });
  return json.user;
}
