import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="w-full bg-white px-12 py-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src={logo} alt="DailyDo Logo" className="w-8 h-8 object-contain" />
        <h1 className="text-2xl font-semibold text-primary tracking-tight">
          DailyDo
        </h1>
      </div>

      <Link
        to="/login"
        className="px-6 py-2 rounded-full bg-primary text-white hover:opacity-90 transition"
      >
        Login
      </Link>
    </nav>
  );
};

export default Navbar;