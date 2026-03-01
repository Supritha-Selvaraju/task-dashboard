import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import TaskBoard from "../components/tasks/TaskBoard";
import { apiFetch } from "../lib/api";
import { useWeeklyAnalytics } from "../components/dashboard/useWeeklyAnalytics";

export default function TeamPage() {
  const { teamId } = useParams();
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchTeamData() {
    try {
      const tasksRes = await apiFetch(`/tasks/team/${teamId}`);
      const membersRes = await apiFetch(`/teams/${teamId}/members`);

      setTasks(tasksRes);
      setMembers(membersRes);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (teamId) fetchTeamData();
  }, [teamId]);

  const analytics = useWeeklyAnalytics(tasks, "team");

  const handleTasksChange = (updatedTasks: any[]) => {
    setTasks(updatedTasks);
  };

  return (
    <>
      <TaskBoard
        title="Team Tasks"
        tasks={tasks}
        onCreate={() => setOpen(true)}
        analytics={analytics}
        onTasksChange={handleTasksChange}
        isTeamView={true}
      />

      {open && (
        <CreateTaskModal
          teamId={teamId}
          members={members}
          onClose={() => setOpen(false)}
          onSuccess={fetchTeamData}
        />
      )}
    </>
  );
}
