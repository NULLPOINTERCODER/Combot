import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
