import { apiRequest } from "api/request";
import type { Article } from "types/conduit";

type GetArticlesParams = {
  limit?: number;
  offset?: number;
  tag?: string;
  author?: string;
  favorited?: string;
};

type GetArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

export async function getArticles(params?: GetArticlesParams): Promise<GetArticlesResponse> {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, String(value));
      }
    });
  }

  const suffix = query.toString();
  const path = `/articles${suffix ? `?${suffix}` : ""}`;

  return apiRequest<GetArticlesResponse>(path);
}