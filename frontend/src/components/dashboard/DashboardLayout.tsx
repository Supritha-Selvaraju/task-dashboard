import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface Props {
  children: ReactNode;
  onCreateTask?: () => void;
  onSearchChange?: (value: string) => void;
}

export default function DashboardLayout({
  children,
  onCreateTask,
  onSearchChange,
}: Props) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-light flex">

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">

        <Topbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onCreateTask={onCreateTask}
          onSearchChange={onSearchChange}
          onLogout={handleLogout}
        />

        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>

      </div>

    </div>
  );
}