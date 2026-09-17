import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

import HomePage from "./pages/HomePage.jsx";
import ChangelogDetailPage from "./pages/ChangelogDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

import DashboardPage from "./pages/admin/DashboardPage.jsx";
import ChangelogListPage from "./pages/admin/ChangelogListPage.jsx";
import ChangelogCreatePage from "./pages/admin/ChangelogCreatePage.jsx";
import ChangelogEditPage from "./pages/admin/ChangelogEditPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/changelog" element={<HomePage />} />
        <Route path="/changelog/:slug" element={<ChangelogDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Protected (any logged-in user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout title="Dashboard" />}>
          <Route path="/admin" element={<DashboardPage />} />
        </Route>
        <Route element={<AdminLayout title="Changelogs" />}>
          <Route path="/admin/changelogs" element={<ChangelogListPage />} />
          <Route path="/admin/changelogs/new" element={<ChangelogCreatePage />} />
          <Route path="/admin/changelogs/:id/edit" element={<ChangelogEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<div className="p-8 text-center text-slate-500">Page not found</div>} />
    </Routes>
  );
}
