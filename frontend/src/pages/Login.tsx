import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import hero from "../assets/hero.jpg";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });

      login(data.token, data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Invalid credentials");
    }
  };

  const handleGoogleClick = () => {
    toast("Google authentication coming soon 🚀");
  };

  return (
    <div className="min-h-screen bg-light flex">

      {/* LEFT IMAGE */}
      <div className="hidden lg:flex w-1/2 bg-white items-center justify-center p-12">
        <img
          src={hero}
          alt="DailyDo Preview"
          className="w-full max-w-2xl object-contain drop-shadow-xl"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 lg:px-20 bg-white">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src={logo} alt="DailyDo Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-semibold text-primary">
            DailyDo
          </h1>
        </div>

        <div className="max-w-md w-full">

          <h2 className="text-3xl font-bold text-primary mb-2">
            Welcome Back
          </h2>
          <p className="text-secondary mb-8">
            Sign in to continue managing your tasks.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-secondary/30 focus:outline-none focus:ring-2 focus:ring-accent transition"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-secondary/30 focus:outline-none focus:ring-2 focus:ring-accent transition"
              required
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-secondary hover:text-primary transition"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-secondary/30"></div>
            <span className="px-4 text-sm text-secondary">OR</span>
            <div className="flex-1 h-px bg-secondary/30"></div>
          </div>

          {/* Google Button (UI only) */}
          <button
            onClick={handleGoogleClick}
            className="w-full py-4 rounded-xl border border-secondary/40 text-primary font-medium hover:bg-light transition"
          >
            Continue with Google
          </button>

          {/* Signup */}
          <p className="text-center mt-8 text-sm text-secondary">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}