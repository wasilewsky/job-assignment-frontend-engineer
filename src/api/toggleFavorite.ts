import { apiRequest } from "api/request";
import type { Article } from "types/conduit";

export async function favoriteArticle(slug: string, token: string): Promise<Article> {
  const path = `/articles/${encodeURIComponent(slug)}/favorite`;
  const data = await apiRequest<{ article: Article }>(path, {
    method: "POST",
    token,
  });
  return data.article;
}

export async function unfavoriteArticle(slug: string, token: string): Promise<Article> {
  const path = `/articles/${encodeURIComponent(slug)}/favorite`;
  const data = await apiRequest<{ article: Article }>(path, {
    method: "DELETE",
    token,
  });
  return data.article;
}