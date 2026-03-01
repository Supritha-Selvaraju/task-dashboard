import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import TaskBoard from "../components/tasks/TaskBoard";
import { useWeeklyAnalytics } from "../components/dashboard/useWeeklyAnalytics";
import CreateTaskModal from "../components/tasks/CreateTaskModal";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchTasks() {
    const res = await apiFetch("/tasks");
    setTasks(res.filter((t: any) => !t.teamId));
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const analytics = useWeeklyAnalytics(tasks, "personal");

  const handleTasksChange = (updatedTasks: any[]) => {
    setTasks(updatedTasks);
  };

  return (
    <>
      <TaskBoard
        title="My Tasks"
        tasks={tasks}
        analytics={analytics}
        onCreate={() => setOpen(true)}
        onTasksChange={handleTasksChange}
      />

      {open && (
        <CreateTaskModal
          onClose={() => setOpen(false)}
          onSuccess={fetchTasks}
        />
      )}
    </>
  );
}
