import { apiRequest } from "api/request";
import type { Article } from "types/conduit";

/**
 * Favorites an article and returns updated article payload.
 */
export async function favoriteArticle(slug: string, token: string): Promise<Article> {
  const path = `/articles/${encodeURIComponent(slug)}/favorite`;
  const data = await apiRequest<{ article: Article }>(path, {
    method: "POST",
    token,
    body: {},
  });
  return data.article;
}

/**
 * Unfavorites an article and returns updated article payload.
 */
export async function unfavoriteArticle(slug: string, token: string): Promise<Article> {
  const path = `/articles/${encodeURIComponent(slug)}/favorite`;
  const data = await apiRequest<{ article: Article }>(path, {
    method: "DELETE",
    token,
  });
  return data.article;
}