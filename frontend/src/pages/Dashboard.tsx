import { useEffect, useState, useMemo, useCallback } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import WorkflowBanner from "../components/dashboard/WorkflowBanner";
import WeeklyAnalytics from "../components/dashboard/WeeklyAnalytics";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import TaskCard from "../components/tasks/TaskCard";
import TaskControls from "../components/tasks/TaskControls";
import TaskCalendar from "../components/dashboard/TaskCalendar";
import { Task } from "../types";
import { apiFetch } from "../lib/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "status">("priority");
  const [filters, setFilters] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // FETCH TASKS
  const fetchTasks = useCallback(async () => {
    try {
      const data = await apiFetch("/tasks");
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // FILTER + SEARCH + SORT + DATE
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search
    if (search) {
      filtered = filtered.filter((task) =>
        task.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filters
    if (filters.length > 0) {
      filtered = filtered.filter((task) =>
        filters.includes(task.status)
      );
    }

    // Date filter (SAFE comparison)
    if (selectedDate) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;

        const taskDate = new Date(task.dueDate);
        return (
          taskDate.getFullYear() === selectedDate.getFullYear() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getDate() === selectedDate.getDate()
        );
      });
    }

    // Sort
    if (sortBy === "priority") {
      const order: any = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      filtered.sort((a, b) => order[b.priority] - order[a.priority]);
    }

    if (sortBy === "status") {
      const order: any = { TODO: 1, IN_PROGRESS: 2, DONE: 3 };
      filtered.sort((a, b) => order[a.status] - order[b.status]);
    }

    return filtered;
  }, [tasks, search, sortBy, filters, selectedDate]);

  // UPDATE STATUS (optimistic)
  const updateTaskStatus = async (id: string, status: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );

    try {
      await apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    } catch (err) {
      fetchTasks();
    }
  };

  // DELETE TASK
  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));

    try {
      await apiFetch(`/tasks/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      fetchTasks();
    }
  };

  return (
    <DashboardLayout onCreateTask={() => setIsModalOpen(true)}>
      {isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchTasks}
        />
      )}

      {/* Top */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2">
          <WorkflowBanner />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Calendar</h3>

          <TaskCalendar
            tasks={tasks}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyAnalytics tasks={tasks} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Tasks</h3>

            <TaskControls
              onSearch={setSearch}
              onSort={setSortBy}
              onFilter={setFilters}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {filteredTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No matching tasks
              </p>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={updateTaskStatus}
                  onDelete={deleteTask}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}