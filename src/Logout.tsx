import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export default function Logout() {
  const history = useHistory();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    history.push("/");
  }, [logout, history]);

  return <div>Signing out...</div>;
}
