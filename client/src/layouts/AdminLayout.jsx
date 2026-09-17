import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import AdminHeader from "../components/AdminHeader.jsx";

export default function AdminLayout({ title }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader title={title || "Admin"} />
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
