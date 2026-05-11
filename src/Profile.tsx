import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { getProfile } from "api/getProfile";
import { getArticles } from "api/getArticles";
import { followUser, unfollowUser } from "api/toggleFollow";
import { favoriteArticle, unfavoriteArticle } from "api/toggleFavorite";
import { useAuth } from "context/AuthContext";
import type { Profile as ConduitProfile, Article } from "types/conduit";
import { resolveAvatarUrl } from "avatarFallback";
import { formatArticleDate } from "utils/date";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const isFavoritesTab = location.pathname.endsWith("/favorites");
  const [profile, setProfile] = useState<ConduitProfile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const { token, initializing } = useAuth();

  useEffect(() => {
    if (initializing) {
      return;
    }

    if (!username) {
      setError("Invalid profile username.");
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);

    const articleQuery = isFavoritesTab
      ? { favorited: username, limit: 20, offset: 0 }
      : { author: username, limit: 20, offset: 0 };

    Promise.all([getProfile(username, token), getArticles(articleQuery, token)])
      .then(([fetchedProfile, fetchedArticles]) => {
        if (mounted) {
          setProfile(fetchedProfile);
          setArticles(fetchedArticles.articles);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load profile.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [username, token, initializing, isFavoritesTab]);

  const handleFollowClick = async () => {
    if (!token) {
      window.location.hash = "/login";
      return;
    }
    if (!profile) return;
    try {
      let updatedProfile: ConduitProfile;
      if (profile.following) {
        updatedProfile = await unfollowUser(profile.username, token);
      } else {
        updatedProfile = await followUser(profile.username, token);
      }
      setProfile(updatedProfile);
    } catch {
      setError("Error updating follow status.");
    }
  };

  const handleFavoriteClick = async (article: Article) => {
    if (!token) {
      window.location.hash = "/login";
      return;
    }
    setFavoriteError(null);
    try {
      const updated = article.favorited
        ? await unfavoriteArticle(article.slug, token)
        : await favoriteArticle(article.slug, token);
      setArticles((prev) => prev.map((a) => (a.slug === updated.slug ? updated : a)));
    } catch {
      setFavoriteError("Could not update favorite. Please try again.");
    }
  };

  return (
    <div className="profile-page">
        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                {loading ? (
                  <div style={{ padding: "24px", textAlign: "center" }}>Loading profile...</div>
                ) : error ? (
                  <div style={{ padding: "24px", color: "red", textAlign: "center" }}>{error}</div>
                ) : profile ? (
                  <>
                    <img
                      src={resolveAvatarUrl(profile.image)}
                      className="user-img"
                      alt={profile.username}
                    />
                    <h4>{profile.username}</h4>
                    <p>{profile.bio || "No bio available."}</p>
                    <button
                      className={
                        "btn btn-sm action-btn" +
                        (profile.following
                          ? " btn-outline-secondary active"
                          : " btn-outline-secondary")
                      }
                      onClick={handleFollowClick}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="ion-plus-round" />
                      &nbsp;{profile.following ? "Unfollow" : "Follow"} {profile.username}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">
                <ul className="nav nav-pills outline-active">
                  <li className="nav-item">
                    <NavLink
                      exact
                      className="nav-link"
                      activeClassName="active"
                      to={`/profile/${username}`}
                    >
                      My Articles
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      exact
                      className="nav-link"
                      activeClassName="active"
                      to={`/profile/${username}/favorites`}
                    >
                      Favorited Articles
                    </NavLink>
                  </li>
                </ul>
              </div>
              {/* Article List */}
              {loading ? (
                <div style={{ padding: "24px", textAlign: "center" }}>Loading articles...</div>
              ) : error ? (
                <div style={{ padding: "24px", color: "red", textAlign: "center" }}>{error}</div>
              ) : articles.length === 0 ? (
                <div className="article-preview" style={{ textAlign: "center", color: "#bbb" }}>
                  {isFavoritesTab ? "No favorited articles yet." : "This author has no articles yet."}
                </div>
              ) : (
                <>
                  {favoriteError && (
                    <div style={{ color: "red", marginBottom: "12px" }}>{favoriteError}</div>
                  )}
                  {articles.map((article) => (
                  <div className="article-preview" key={article.slug}>
                    <div className="article-meta">
                      <a href={`/#/profile/${article.author.username}`}>
                        <img
                          src={resolveAvatarUrl(article.author.image)}
                          alt={article.author.username}
                        />
                      </a>
                      <div className="info">
                        <a
                          href={`/#/profile/${article.author.username}`}
                          className="author"
                        >
                          {article.author.username}
                        </a>
                        <span className="date">
                          {formatArticleDate(article.createdAt)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`btn btn-outline-primary btn-sm pull-xs-right${article.favorited ? " active" : ""}`}
                        onClick={() => handleFavoriteClick(article)}
                        aria-pressed={article.favorited}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ion-heart" /> {article.favoritesCount}
                      </button>
                    </div>
                    <a href={`/#/${article.slug}`} className="preview-link">
                      <h1>{article.title}</h1>
                      <p>{article.description}</p>
                      <span>Read more...</span>
                      {article.tagList && article.tagList.length > 0 && (
                        <ul className="tag-list">
                          {article.tagList.map((tag) => (
                            <li
                              key={tag}
                              className="tag-default tag-pill tag-outline"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </a>
                  </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
