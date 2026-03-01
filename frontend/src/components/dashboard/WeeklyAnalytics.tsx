import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { useWeeklyAnalytics } from "./useWeeklyAnalytics";
import { Task } from "../../types";

interface Props {
  tasks: Task[];
}

export default function WeeklyAnalytics({ tasks }: Props) {
  const [view, setView] = useState<"personal" | "team">("personal");
  const data = useWeeklyAnalytics(tasks, view);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-full flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-primary">
          Weekly Analytics
        </h3>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("personal")}
            className={`px-4 py-1 rounded-md text-sm transition ${
              view === "personal"
                ? "bg-white shadow text-primary"
                : "text-gray-500"
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => setView("team")}
            className={`px-4 py-1 rounded-md text-sm transition ${
              view === "team"
                ? "bg-white shadow text-primary"
                : "text-gray-500"
            }`}
          >
            Team
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="createdGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey="created"
              stroke="#4f46e5"
              fill="url(#createdGradient)"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="completed"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}