import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { Lock, CheckCircle2, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md pt-4 pb-12">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-soft animate-fade-in">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Password Reset Successful</h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Your password has been updated. Redirecting to{" "}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              login
            </Link>
            ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md pt-4 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-soft">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Choose new password</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Please enter a secure password with at least 8 characters</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">New Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Min 8 characters"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <span>{loading ? "Updating password..." : "Set new password"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

