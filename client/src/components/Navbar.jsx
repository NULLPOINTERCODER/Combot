import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import BellButton from "./BellButton.jsx";
import { Sparkles, ShieldCheck, LogOut, User as UserIcon, Rss } from "lucide-react";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20 transition-transform group-hover:scale-105">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
              Changelog
            </span>
            <span className="ml-1.5 hidden rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700 sm:inline-block border border-brand-200/60">
              Widget
            </span>
          </div>
        </Link>

        {/* Navigation / Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {/* Public JSON Feed quick link */}
          <a
            href="/api/v1/changelog/feed"
            target="_blank"
            rel="noreferrer"
            title="Public JSON Feed"
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:inline-flex transition"
          >
            <Rss className="h-3.5 w-3.5 text-amber-500" />
            <span>Feed</span>
          </a>

          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition shadow-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-brand-300" />
              <span>Admin Studio</span>
            </Link>
          )}

          {isAuthenticated && <BellButton />}

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1 border border-slate-200/80">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="hidden max-w-[120px] truncate text-xs font-semibold text-slate-700 sm:inline">
                  {user.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-brand-500/25 hover:bg-brand-700 transition hover:shadow-md"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
