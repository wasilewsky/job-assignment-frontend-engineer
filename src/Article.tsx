import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticle } from "api/getArticle";
import type { Article as ArticleModel } from "types/conduit";
import { formatArticleDate } from "utils/date";
import { useAuth } from "context/AuthContext";
import { favoriteArticle, unfavoriteArticle } from "api/toggleFavorite";

const AVATAR_FALLBACK = "https://static.productionready.io/images/smiley-cyrus.jpg";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!slug) {
      setError("Invalid article slug.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const nextArticle = await getArticle(slug);
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
  }, [slug]);

  // Handler for favorite button
  const handleFavoriteClick = async () => {
    if (!token) {
      window.location.hash = "/login";
      return;
    }
    if (!article) return;
    try {
      let updated: ArticleModel;
      if (article.favorited) {
        updated = await unfavoriteArticle(article.slug, token);
      } else {
        updated = await favoriteArticle(article.slug, token);
      }
      setArticle(updated);
    } catch (err) {
      setError("Error updating favorite status.");
    }
  };

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

      <div className="article-page">
        {loading ? (
          <div style={{ padding: "24px", textAlign: "center" }}>Loading article...</div>
        ) : error ? (
          <div style={{ padding: "24px", color: "red", textAlign: "center" }}>{error}</div>
        ) : article ? (
          <>
            <div className="banner">
              <div className="container">
                <h1>{article.title}</h1>

                <div className="article-meta">
                  <a href={`/#/profile/${article.author.username}`}>
                    <img src={article.author.image || AVATAR_FALLBACK} alt={article.author.username} />
                  </a>
                  <div className="info">
                    <a href={`/#/profile/${article.author.username}`} className="author">
                      {article.author.username}
                    </a>
                    <span className="date">{formatArticleDate(article.createdAt)}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-plus-round" />
                    &nbsp; Follow {article.author.username} <span className="counter">(10)</span>
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
                    <img src={article.author.image || AVATAR_FALLBACK} alt={article.author.username} />
                  </a>
                  <div className="info">
                    <a href={`/#/profile/${article.author.username}`} className="author">
                      {article.author.username}
                    </a>
                    <span className="date">{formatArticleDate(article.createdAt)}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary">
                    <i className="ion-plus-round" />
                    &nbsp; Follow {article.author.username}
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
                      <img src={article.author.image || AVATAR_FALLBACK} className="comment-author-img" alt={article.author.username} />
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
