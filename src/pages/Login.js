import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import BorderGlow from "../components/BorderGlow";
import "./login.css";

const Login = ({ isAdmin = false }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectAfterLogin = (nextRole) => {
    const target = nextRole === "admin" ? "/admin/dashboard" : "/home";
    // Hard navigation avoids occasional stale-router state after OAuth callbacks.
    window.location.replace(target);
  };

  useEffect(() => {
    const existingToken = localStorage.getItem("token");
    const existingRole = localStorage.getItem("role");

    if (existingToken) {
      navigate(existingRole === "admin" ? "/admin/dashboard" : "/home", {
        replace: true,
      });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      window.dispatchEvent(new Event("authChanged"));
      redirectAfterLogin(data.role);
    } catch {
      alert("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      alert("Google credential missing");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Google login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "user");
      window.dispatchEvent(new Event("authChanged"));
      redirectAfterLogin(data.role || "user");
    } catch {
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="login-page">
      <BorderGlow
        className="login-card-glow"
        backgroundColor="#1e293b"
        borderRadius={16}
        glowRadius={35}
        glowColor="240 80 80"
        colors={['#60a5fa', '#ec4899', '#8b5cf6']}
      >
        <div className="login-card-inner">

        <div className="login-header">
          <img src="/images/logo.png" alt="YUVA" />
          <h2>{isAdmin ? "Admin sign in" : "Welcome back"}</h2>
          <p>{isAdmin ? "Sign in to continue to YUVA Admin" : "Sign in to continue to YUVA"}</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {!isAdmin && (
          <>
            <div className="login-divider">OR</div>

            <div className="google-login">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert("Google Login Failed")}
              />
            </div>

            <p className="login-footer">
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")}>Create one</span>
            </p>
          </>
        )}

        </div>
      </BorderGlow>
    </div>
  );
};
export default Login;
