import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { useAuthStore } from "../../stores/authStore";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  teamId?: string;          // ✅ NEW
  members?: any[];          // ✅ NEW
}

export default function CreateTaskModal({
  onClose,
  onSuccess,
  teamId,
  members,
}: Props) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("LOW");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState(""); // ✅ NEW
  
  // Filter out current user from members list
  const availableMembers = members?.filter((m) => m.user.id !== user?.id) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const taskData: Record<string, unknown> = {
      title,
      description,
      priority,
      status: "TODO",
    };

    if (dueDate) {
      taskData.dueDate = dueDate;
      console.log("dueDate value:", dueDate);
    }

    // ✅ Only add assignee in team mode
    if (teamId && assigneeId) {
      taskData.assigneeId = assigneeId;
    }

    // ✅ Switch endpoint depending on mode
    const endpoint = teamId
      ? `/tasks/team/${teamId}`
      : "/tasks";

    await apiFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(taskData),
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          {teamId ? "Create Team Task" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>

          {/* ✅ Assign dropdown only in team mode */}
          {teamId && availableMembers && availableMembers.length > 0 && (
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="">Assign to</option>
              {availableMembers.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.name || m.user.email}
                </option>
              ))}
            </select>
          )}

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
            >
              Create
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}