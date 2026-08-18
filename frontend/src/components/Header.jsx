import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-6xl mx-auto px-8 py-3 flex items-center justify-between">
        <Link to="/students" className="flex items-center gap-2.5">
          <img src={logo} alt="Forum Information Academy" className="h-8 w-auto" />
          <span className="font-display font-bold text-lg text-[var(--color-teal-600)]">
            Forum Information Academy
          </span>
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--color-ink-soft)]">{user.username}</span>
            <button onClick={logout} className="btn-secondary text-xs py-1.5 px-3">
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}