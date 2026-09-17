import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!token) return setStatus("error");
    authService
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="mx-auto max-w-md pt-4 pb-12">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 text-center shadow-soft animate-fade-in">
        {status === "verifying" && (
          <div className="py-6">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600" />
            <p className="mt-4 text-sm font-semibold text-slate-700">Verifying your email address...</p>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-sm">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Email Verified!</h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              Your email has been successfully verified. You now have full access to your account.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-brand-500/25 hover:bg-brand-700 transition"
              >
                <span>Proceed to Login</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200/60 shadow-sm">
              <XCircle className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Verification Link Expired</h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
              This verification link is invalid or has already expired.
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

