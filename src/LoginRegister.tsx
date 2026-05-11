import React, { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
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
    <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              {!isLogin ? (
                <>
                  <h1 className="text-xs-center">Registration</h1>
                  <p className="text-xs-center">
                    Registration is not implemented in this assignment.<br />
                    <Link to="/login">Back to login</Link>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-xs-center">Sign in</h1>
                  <p className="text-xs-center">
                    <Link to="/register">Need an account?</Link>
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
  );
}
