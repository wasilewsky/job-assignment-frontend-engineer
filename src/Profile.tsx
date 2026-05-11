import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "api/getProfile";
import { getArticles } from "api/getArticles";
import type { Profile, Article } from "types/conduit";
import { formatArticleDate } from "utils/date";

const AVATAR_FALLBACK = "https://static.productionready.io/images/smiley-cyrus.jpg";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError("Invalid profile username.");
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);

    Promise.all([
      getProfile(username),
      getArticles({ author: username, limit: 20, offset: 0 }),
    ])
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
  }, [username]);

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              {/* Add "active" class when you're on that page" */}
              <a className="nav-link active" href="/#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/editor">
                <i className="ion-compose" />
                &nbsp;New Article
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/settings">
                <i className="ion-gear-a" />
                &nbsp;Settings
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/login">
                Sign in
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/register">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      </nav>

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
                      src={profile.image || AVATAR_FALLBACK}
                      className="user-img"
                      alt={profile.username}
                    />
                    <h4>{profile.username}</h4>
                    <p>{profile.bio || "No bio available."}</p>
                    <button className="btn btn-sm btn-outline-secondary action-btn">
                      <i className="ion-plus-round" />
                      &nbsp; Follow {profile.username}
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
                    <a className="nav-link active" href="">
                      My Articles
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="">
                      Favorited Articles
                    </a>
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
                  This author has no articles yet.
                </div>
              ) : (
                articles.map((article) => (
                  <div className="article-preview" key={article.slug}>
                    <div className="article-meta">
                      <a href={`/#/profile/${article.author.username}`}>
                        <img
                          src={article.author.image || AVATAR_FALLBACK}
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
                      <button className="btn btn-outline-primary btn-sm pull-xs-right">
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="container">
          <a href="/#" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}
