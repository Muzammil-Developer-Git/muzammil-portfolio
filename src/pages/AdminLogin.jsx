import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { isAdmin, loading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      if (err.message === "not-admin") {
        setError("This account is not an administrator.");
      } else if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Incorrect email or password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Could not log in: " + (err.message || "unknown error"));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="center-screen">
      <div className="card" style={{ width: "min(420px, 100%)" }}>
        <h1 style={{ fontSize: "1.6rem", marginBottom: 6 }}>Admin Login</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          For the portfolio owner only.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
            <LogIn size={18} /> {busy ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: 18, textAlign: "center" }}>
          <Link to="/" className="muted">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}