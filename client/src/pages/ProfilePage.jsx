import { useAuth } from "../hooks/useAuth.js";
import { User, Mail, Shield, CheckCircle2, XCircle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-md pt-4 pb-12">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-7 sm:p-9 shadow-soft space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white text-xl font-bold shadow-md shadow-brand-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-xs space-y-3">
          <div className="flex items-center justify-between pt-1">
            <span className="font-medium text-slate-500 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
              Role
            </span>
            <span className="font-bold uppercase tracking-wider text-slate-800 rounded bg-white px-2 py-0.5 border border-slate-200">
              {user?.role}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="font-medium text-slate-500 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              Email Status
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              {user?.isEmailVerified ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Verified
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 text-amber-500" />
                  Pending
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

