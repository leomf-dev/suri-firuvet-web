import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
