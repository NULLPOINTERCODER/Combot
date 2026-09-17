import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { KeyRound, Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devUrl, setDevUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setMessage(res.data.message);
      setDevUrl(res.data.data?.devResetUrl || "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pt-4 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-soft">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white shadow-md shadow-brand-500/20">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Forgot password</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">Enter your email and we'll send a password recovery link</p>
        </div>

        {message ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-center">
              <p className="text-xs font-semibold text-slate-700 leading-relaxed">{message}</p>
              {devUrl && (
                <div className="mt-4 pt-3 border-t border-brand-200/50">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-800 mb-2">Development Mode Action</p>
                  <Link
                    to={devUrl.replace(window.location.origin, "")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700 transition"
                  >
                    <span>Open Reset Password Link</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
            <div className="text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Your Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 px-4 text-sm font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 disabled:opacity-60 transition"
            >
              <span>{loading ? "Sending link..." : "Send reset link"}</span>
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Remember your password?{" "}
              <Link to="/login" className="font-bold text-brand-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

