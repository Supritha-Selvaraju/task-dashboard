import { useMemo } from "react";
import { Task } from "../../types";

export function useWeeklyAnalytics(tasks: Task[], type: "personal" | "team") {
  return useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });

    const filtered = tasks.filter((task) =>
      type === "personal"
        ? !task.teamId
        : task.teamId
    );

    return weekDays.map((date) => {
      const created = filtered.filter(
        (t) =>
          new Date(t.createdAt).toDateString() ===
          date.toDateString()
      ).length;

      const completed = filtered.filter(
        (t) =>
          t.status === "DONE" &&
          new Date(t.updatedAt).toDateString() ===
            date.toDateString()
      ).length;

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        created,
        completed,
      };
    });
  }, [tasks, type]);
}