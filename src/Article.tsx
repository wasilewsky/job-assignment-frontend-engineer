import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticle } from "api/getArticle";
import type { Article as ArticleModel } from "types/conduit";
import { formatArticleDate } from "utils/date";
import { useAuth } from "context/AuthContext";
import { favoriteArticle, unfavoriteArticle } from "api/toggleFavorite";
import { followUser, unfollowUser } from "api/toggleFollow";
import { resolveAvatarUrl } from "avatarFallback";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { token, initializing } = useAuth();

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (!slug) {
      setError("Invalid article slug.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);
    setActionError(null);

    (async () => {
      try {
        const nextArticle = await getArticle(slug, token);
        if (mounted) {
          setArticle(nextArticle);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load article.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug, token, initializing]);

  // Handler for favorite button
  const handleFavoriteClick = async () => {
    if (!token) {
      window.location.hash = "/login";
      return;
    }
    if (!article) return;
    setActionError(null);
    try {
      let updated: ArticleModel;
      if (article.favorited) {
        updated = await unfavoriteArticle(article.slug, token);
      } else {
        updated = await favoriteArticle(article.slug, token);
      }
      setArticle(updated);
    } catch {
      setActionError("Could not update favorite. Please try again.");
    }
  };

  // Handler for follow/unfollow button
  const handleFollowClick = async () => {
    if (!token) {
      window.location.hash = "/login";
      return;
    }
    if (!article) return;
    setActionError(null);
    try {
      const nextProfile = article.author.following
        ? await unfollowUser(article.author.username, token)
        : await followUser(article.author.username, token);
      setArticle((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          author: nextProfile,
        };
      });
    } catch {
      setActionError("Could not update follow status. Please try again.");
    }
  };

  return (
    <div className="article-page">
        {loading ? (
          <div style={{ padding: "24px", textAlign: "center" }}>Loading article...</div>
        ) : error ? (
          <div style={{ padding: "24px", color: "red", textAlign: "center" }}>{error}</div>
        ) : article ? (
          <>
            {actionError && (
              <div className="container" style={{ paddingTop: "12px" }}>
                <div style={{ color: "red" }}>{actionError}</div>
              </div>
            )}
            <div className="banner">
              <div className="container">
                <h1>{article.title}</h1>

                <div className="article-meta">
                  <a href={`/#/profile/${article.author.username}`}>
                    <img src={resolveAvatarUrl(article.author.image)} alt={article.author.username} />
                  </a>
                  <div className="info">
                    <a href={`/#/profile/${article.author.username}`} className="author">
                      {article.author.username}
                    </a>
                    <span className="date">{formatArticleDate(article.createdAt)}</span>
                  </div>
                  <button
                    className={`btn btn-sm btn-outline-secondary${article.author.following ? " active" : ""}`}
                    onClick={handleFollowClick}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ion-plus-round" />
                    &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}
                  </button>
                  &nbsp;&nbsp;
                  <button
                    className={`btn btn-sm btn-outline-primary${article.favorited ? " active" : ""}`}
                    onClick={handleFavoriteClick}
                    aria-pressed={article.favorited}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ion-heart" />
                    &nbsp; Favorite Post <span className="counter">({article.favoritesCount})</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="container page">
              <div className="row article-content">
                <div className="col-md-12">
                  <p>{article.body}</p>
                </div>
              </div>

              <hr />

              <div className="article-actions">
                <div className="article-meta">
                  <a href={`/#/profile/${article.author.username}`}>
                    <img src={resolveAvatarUrl(article.author.image)} alt={article.author.username} />
                  </a>
                  <div className="info">
                    <a href={`/#/profile/${article.author.username}`} className="author">
                      {article.author.username}
                    </a>
                    <span className="date">{formatArticleDate(article.createdAt)}</span>
                  </div>
                  <button
                    className={`btn btn-sm btn-outline-secondary${article.author.following ? " active" : ""}`}
                    onClick={handleFollowClick}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ion-plus-round" />
                    &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}
                  </button>
                  &nbsp;
                  <button
                    className={`btn btn-sm btn-outline-primary${article.favorited ? " active" : ""}`}
                    onClick={handleFavoriteClick}
                    aria-pressed={article.favorited}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ion-heart" />
                    &nbsp; Favorite Post <span className="counter">({article.favoritesCount})</span>
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-xs-12 col-md-8 offset-md-2">
                  <form className="card comment-form">
                    <div className="card-block">
                      <textarea className="form-control" placeholder="Write a comment..." rows={3} />
                    </div>
                    <div className="card-footer">
                      <img src={resolveAvatarUrl(article.author.image)} className="comment-author-img" alt={article.author.username} />
                      <button className="btn btn-sm btn-primary">Post Comment</button>
                    </div>
                  </form>

                  <div className="card">
                    <div className="card-block">
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    <div className="card-footer">
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" alt="Jacob Schmidt" />
                      </a>
                      &nbsp;
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        Jacob Schmidt
                      </a>
                      <span className="date-posted">Dec 29th</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-block">
                      <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                    </div>
                    <div className="card-footer">
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" alt="Jacob Schmidt" />
                      </a>
                      &nbsp;
                      <a href="/#/profile/jacobschmidt" className="comment-author">
                        Jacob Schmidt
                      </a>
                      <span className="date-posted">Dec 29th</span>
                      <span className="mod-options">
                        <i className="ion-edit" />
                        <i className="ion-trash-a" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
    </div>
  );
}
