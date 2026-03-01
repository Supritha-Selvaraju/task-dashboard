import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import TaskControls from "./TaskControls";
import { apiFetch } from "../../lib/api";

interface Props {
  title: string;
  tasks: any[];
  onCreate?: () => void;
  onTasksChange?: (tasks: any[]) => void;
  analytics: any[];
  showTeamName?: boolean;
  isTeamView?: boolean;
}

export default function TaskBoard({
  title,
  tasks,
  onCreate,
  onTasksChange,
  analytics,
  showTeamName = false,
  isTeamView = false,
}: Props) {
  const currentUserId = localStorage.getItem("userId");

  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  /* ===============================
     STATUS COUNTS (LIVE)
  =============================== */

  const statusCounts = useMemo(() => {
    return {
      TODO: filteredTasks.filter((t) => t.status === "TODO").length,
      IN_PROGRESS: filteredTasks.filter(
        (t) => t.status === "IN_PROGRESS"
      ).length,
      DONE: filteredTasks.filter((t) => t.status === "DONE").length,
    };
  }, [filteredTasks]);

  const total = filteredTasks.length;
  const progress = total
    ? Math.round((statusCounts.DONE / total) * 100)
    : 0;

  /* ===============================
     UPDATE STATUS
  =============================== */

  const updateStatus = async (
    taskId: string,
    newStatus: string
  ) => {
    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      setFilteredTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: newStatus }
            : t
        )
      );
      
      // Notify parent to update analytics
      const updatedTasks = filteredTasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      onTasksChange?.(updatedTasks);
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  /* ===============================
     DELETE TASK
  =============================== */

  const deleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/tasks/${taskId}`, {
        method: "DELETE",
      });

      setFilteredTasks((prev) =>
        prev.filter((t) => t.id !== taskId)
      );
      
      // Notify parent to update analytics
      const updatedTasks = filteredTasks.filter((t) => t.id !== taskId);
      onTasksChange?.(updatedTasks);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  /* ===============================
     CONTROLS
  =============================== */

  const handleSearch = (value: string) => {
    const lower = value.toLowerCase();
    setFilteredTasks(
      tasks.filter((t) =>
        t.title.toLowerCase().includes(lower)
      )
    );
  };

  const handleSort = (type: "priority" | "status") => {
    const sorted = [...filteredTasks].sort((a, b) =>
      a[type].localeCompare(b[type])
    );
    setFilteredTasks(sorted);
  };

  const handleFilter = (statuses: string[]) => {
    if (!statuses.length) {
      setFilteredTasks(tasks);
      return;
    }

    setFilteredTasks(
      tasks.filter((t) =>
        statuses.includes(t.status)
      )
    );
  };

  /* ===============================
     PIE DATA
  =============================== */

  const pieData = [
    { name: "TODO", value: statusCounts.TODO },
    {
      name: "IN PROGRESS",
      value: statusCounts.IN_PROGRESS,
    },
    { name: "DONE", value: statusCounts.DONE },
  ];

  const STATUS_COLORS = [
    "#9CA3AF",
    "#FACC15",
    "#22C55E",
  ];

  const columnCount = isTeamView
    ? showTeamName
      ? "grid-cols-9"
      : "grid-cols-8"
    : showTeamName
    ? "grid-cols-8"
    : "grid-cols-7";

  return (
    <div className="flex gap-8 p-8">
      {/* LEFT */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm p-6 border">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">
              {title}
            </h1>

            <div className="flex gap-3 mt-3 text-sm">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                Total: {total}
              </span>
              <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full">
                Done: {statusCounts.DONE}
              </span>
              <span className="bg-black text-white px-3 py-1 rounded-full">
                {progress}% Complete
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <TaskControls
              onSearch={handleSearch}
              onSort={handleSort}
              onFilter={handleFilter}
            />

            {onCreate && (
              <button
                onClick={onCreate}
                className="bg-black text-white px-5 py-2 rounded-xl"
              >
                + Create Task
              </button>
            )}
          </div>
        </div>

        {/* TABLE HEADER */}
        <div
          className={`grid ${columnCount} text-sm font-medium text-gray-500 border-b pb-3 mb-3`}
        >
          <div>Task</div>
          {showTeamName && <div>Team</div>}
          {isTeamView && <div>Created By</div>}
          <div>Assigned To</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Due Date</div>
          <div>Actions</div>
        </div>

        {/* TASK ROWS */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            // Allow all team members to edit status in team view
            const canEdit = true;

            return (
              <div
                key={task.id}
                className={`grid ${columnCount} items-center bg-gray-50 rounded-xl p-4`}
              >
                <div>
                  <div className="font-medium">
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {task.description || ""}
                  </div>
                </div>

                {showTeamName && (
                  <div>{task.team?.name || "-"}</div>
                )}

                {isTeamView && (
                  <div>
                    {task.createdBy?.name || "-"}
                  </div>
                )}

                <div>
                  {task.assignee?.name ||
                    task.assigneeName ||
                    (!isTeamView
                      ? "Personal"
                      : "Unassigned")}
                </div>

                <div>{task.priority}</div>

                {/* STATUS */}
                <div>
                  {canEdit ? (
                    <select
                      value={task.status}
                      onChange={(e) =>
                        updateStatus(
                          task.id,
                          e.target.value
                        )
                      }
                      className="text-xs px-2 py-1 rounded-full bg-gray-200"
                    >
                      <option value="TODO">
                        TODO
                      </option>
                      <option value="IN_PROGRESS">
                        IN PROGRESS
                      </option>
                      <option value="DONE">
                        DONE
                      </option>
                    </select>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                      {task.status}
                    </span>
                  )}
                </div>

                <div>
                  {task.dueDate
                    ? new Date(
                        task.dueDate
                      ).toLocaleDateString()
                    : "-"}
                </div>

                {/* DELETE BUTTON */}
                <div>
                  <button
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT ANALYTICS */}
      <div className="w-80 bg-white rounded-2xl shadow-sm p-6 border">
        <h2 className="text-lg font-semibold mb-6">
          Weekly Overview
        </h2>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={analytics}>
            <XAxis dataKey="day" />
            <Tooltip />
            <Bar
              dataKey="completed"
              fill="#111827"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-8">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={STATUS_COLORS[index]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
