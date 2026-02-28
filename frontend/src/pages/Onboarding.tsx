import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hero from "../assets/Onboarding.png";
import logo from "../assets/logo.png";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

export default function Onboarding() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"personal" | "team" | null>(null);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!mode) {
      return toast.error("Please select an option");
    }

    try {
      setLoading(true);

      if (mode === "team") {
        if (!teamName.trim()) {
          return toast.error("Please enter a team name");
        }

        await api.post("/teams", {
          name: teamName,
        });
      }

      toast.success("You're all set 🚀");
      navigate("/dashboard");

    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
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

      {/* RIGHT CONTENT */}
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
            How will you use DailyDo?
          </h2>
          <p className="text-secondary mb-10">
            Choose how you'd like to get started.
          </p>

          {/* Options */}
          <div className="space-y-4">

            {/* Personal */}
            <div
              onClick={() => setMode("personal")}
              className={`p-6 rounded-2xl border cursor-pointer transition ${
                mode === "personal"
                  ? "border-accent bg-light shadow-md"
                  : "border-secondary/30 hover:border-accent/60"
              }`}
            >
              <h3 className="font-semibold text-primary mb-1">
                Personal
              </h3>
              <p className="text-sm text-secondary">
                Manage your own tasks and to-dos.
              </p>
            </div>

            {/* Team */}
            <div
              onClick={() => setMode("team")}
              className={`p-6 rounded-2xl border cursor-pointer transition ${
                mode === "team"
                  ? "border-accent bg-light shadow-md"
                  : "border-secondary/30 hover:border-accent/60"
              }`}
            >
              <h3 className="font-semibold text-primary mb-1">
                With a Team
              </h3>
              <p className="text-sm text-secondary">
                Collaborate and manage tasks together.
              </p>
            </div>

          </div>

          {/* Team Input */}
          {mode === "team" && (
            <div className="mt-6">
              <input
                type="text"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full p-4 rounded-xl border border-secondary/30 focus:outline-none focus:ring-2 focus:ring-accent transition"
              />
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full mt-8 py-4 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>

        </div>
      </div>
    </div>
  );
}