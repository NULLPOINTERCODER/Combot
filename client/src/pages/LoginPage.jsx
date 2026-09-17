import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { Mail, Lock, LogIn, Sparkles, Shield, User } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (email, password) => {
    setForm({ email, password });
    setError("");
    setLoading(true);
    login(email, password)
      .then((user) => navigate(user.role === "admin" ? "/admin" : "/"))
      .catch((err) => setError(err.response?.data?.message || "Login failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-md pt-4 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-soft">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Sign in to react to updates and manage releases</p>
        </div>

        {/* Demo login shortcuts */}
        <div className="mb-6 rounded-2xl border border-brand-100 bg-brand-50/50 p-3.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-800 mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-brand-600" />
            Quick Demo Logins (1-Click)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@example.com", "Admin@12345")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-white py-1.5 px-2 text-xs font-semibold text-brand-900 hover:bg-brand-50 transition shadow-xs"
            >
              <Shield className="h-3.5 w-3.5 text-brand-600" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("alice@example.com", "User@12345")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-1.5 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
            >
              <User className="h-3.5 w-3.5 text-slate-600" />
              <span>User Demo</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" tabIndex={-1} className="text-xs font-medium text-brand-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600 animate-fade-in">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 px-4 text-sm font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 disabled:opacity-60 transition"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-brand-600 hover:underline">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}

