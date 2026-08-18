import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/students" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/students");
    } catch {
      // error already set in context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)]">
      <div className="w-full max-w-sm card p-7">
        <h1 className="font-display font-semibold text-xl mb-1">Sign in</h1>
        <p className="text-sm text-[var(--color-ink-soft)] mb-6">Forum Information Academy</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-[var(--color-danger-500)]">{error}</p>}
          <button type="submit" className="btn-primary w-full">Sign in</button>
        </form>
      </div>
    </div>
  );
}