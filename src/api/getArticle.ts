import { apiRequest } from "api/request";
import type { Article } from "types/conduit";

export async function getArticle(slug: string, token?: string | null): Promise<Article> {
  const path = `/articles/${encodeURIComponent(slug)}`;
  const data = await apiRequest<{ article: Article }>(path, { token });
  return data.article;
}