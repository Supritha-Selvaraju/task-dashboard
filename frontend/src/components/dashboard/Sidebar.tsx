import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuthStore } from "../../stores/authStore";
import TeamsList from "../tasks/sidebar/TeamsList";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

export default function Sidebar({ open, setOpen }: Props) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static z-50
          h-screen lg:h-auto
          w-64 bg-white border-r
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b">
          <img src={logo} alt="DailyDo Logo" className="w-8 h-8" />
          <h2 className="text-xl font-semibold text-primary">
            DailyDo
          </h2>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          <Link
            to="/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-light transition"
          >
            Dashboard
          </Link>

          <Link
            to="/my-tasks"
            className="block px-4 py-2 rounded-lg hover:bg-light transition"
          >
            My Tasks
          </Link>

          {/* ✅ TEAMS SECTION */}
          <TeamsList />
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t">
          <Link
            to="/settings"
            className="block px-4 py-2 rounded-lg hover:bg-light transition"
          >
            Settings
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded-lg hover:bg-light transition text-red-500"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}