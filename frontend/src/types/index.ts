export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  order: number;
  userId: string;
  teamId: string | null;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string | null;
    email: string;
  };
  assignee?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  team?: {
    id: string;
    name: string;
  } | null;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string | null;
    email: string;
  };
  _count?: {
    members: number;
    tasks: number;
  };
}
