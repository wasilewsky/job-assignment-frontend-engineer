import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";

const AVATAR_FALLBACK = "https://static.productionready.io/images/smiley-cyrus.jpg";

function AppNav() {
  const { pathname } = useLocation();
  const { user, token, initializing } = useAuth();
  const authed = !initializing && Boolean(user && token);

  const home = pathname === "/" || pathname === "";
  const editor = pathname.startsWith("/editor");
  const settings = pathname === "/settings";
  const login = pathname === "/login";
  const register = pathname === "/register";
  const logout = pathname === "/logout";
  const profile =
    authed &&
    (pathname === `/profile/${user!.username}` ||
      pathname.startsWith(`/profile/${user!.username}/`));

  const itemClass = (active: boolean) => `nav-item${active ? " active" : ""}`;
  const linkClass = (active: boolean) => `nav-link${active ? " active" : ""}`;

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          conduit
        </Link>
        <ul className="nav navbar-nav pull-xs-right">
          <li className={itemClass(home)}>
            <Link to="/" className={linkClass(home)}>
              Home
            </Link>
          </li>
          {authed ? (
            <>
              <li className={itemClass(editor)}>
                <Link to="/editor" className={linkClass(editor)}>
                  <i className="ion-compose" />
                  &nbsp;New Article
                </Link>
              </li>
              <li className={itemClass(settings)}>
                <Link to="/settings" className={linkClass(settings)}>
                  <i className="ion-gear-a" />
                  &nbsp;Settings
                </Link>
              </li>
              <li className={itemClass(Boolean(profile))}>
                <Link to={`/profile/${user!.username}`} className={linkClass(Boolean(profile))}>
                  <img src={user!.image || AVATAR_FALLBACK} className="user-pic" alt="" />
                  &nbsp;{user!.username}
                </Link>
              </li>
              <li className={itemClass(logout)}>
                <Link to="/logout" className={linkClass(logout)}>
                  Sign out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={itemClass(login)}>
                <Link to="/login" className={linkClass(login)}>
                  Sign in
                </Link>
              </li>
              <li className={itemClass(register)}>
                <Link to="/register" className={linkClass(register)}>
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

function AppFooter() {
  return (
    <footer>
      <div className="container">
        <Link className="logo-font" to="/">
          conduit
        </Link>
        <span className="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  );
}

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <>
      <AppNav />
      {children}
      <AppFooter />
    </>
  );
}
