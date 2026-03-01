import { useAuthStore } from "../../stores/authStore";

interface Props {
  task: any;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: Props) {
  const { user } = useAuthStore();
  
  // Check if user can change status:
  // - Personal tasks: creator can change status
  // - Team tasks: only assignee can change status
  const canChangeStatus = task.teamId 
    ? task.assigneeId === user?.id  // Team task: only assignee
    : task.userId === user?.id;      // Personal task: creator

  const priorityColor =
    task.priority === "HIGH"
      ? "bg-red-100 text-red-600"
      : task.priority === "MEDIUM"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-green-100 text-green-600";

  const statusColor =
    task.status === "DONE"
      ? "bg-green-100 text-green-600"
      : task.status === "IN_PROGRESS"
      ? "bg-blue-100 text-blue-600"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <div className="flex justify-between mb-2">
        <div>
          <h3 className="font-semibold">{task.title}</h3>

          {/* ✅ Show team badge if exists */}
          {task.team && (
            <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-1 inline-block">
              {task.team.name}
            </span>
          )}
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 text-sm"
        >
          Delete
        </button>
      </div>

      <div className="flex gap-3 mb-4 text-sm items-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${priorityColor}`}
        >
          {task.priority}
        </span>

        <span className="text-gray-500">
          Due:{" "}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </span>

        {/* Show assignee for team tasks */}
        {task.assignee && (
          <span className="text-gray-500">
            Assigned: {task.assignee.name || task.assignee.email}
          </span>
        )}
      </div>

      {canChangeStatus ? (
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id, e.target.value)
          }
          className={`px-3 py-1 rounded-full text-xs border ${statusColor}`}
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      ) : (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {task.status === "TODO" ? "TODO" : task.status === "IN_PROGRESS" ? "IN PROGRESS" : "DONE"}
        </span>
      )}
    </div>
  );
}