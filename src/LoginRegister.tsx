import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export default function LoginRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const history = useHistory();
  const location = useLocation();
  const { login } = useAuth();

  const isLogin = location.pathname === "/login";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      history.push("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
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

      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              {!isLogin ? (
                <>
                  <h1 className="text-xs-center">Registration</h1>
                  <p className="text-xs-center">Registration is not implemented in this assignment.<br />
                    <a href="/login">Back to login</a>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xs-center">Sign in</h1>
                  <p className="text-xs-center">
                    <a href="/register">Need an account?</a>
                  </p>
                  {error && (
                    <ul className="error-messages">
                      <li>{error}</li>
                    </ul>
                  )}
                  <form onSubmit={handleSubmit}>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                      />
                    </fieldset>
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary pull-xs-right"
                      disabled={loading}
                    >
                      {loading ? "Signing in..." : "Sign in"}
                    </button>
                  </form>
                </>
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
