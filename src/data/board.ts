
import type { Columns, TaskTag, Tasks } from "../types/board";
export const initialTasks: Tasks = {
  "task-1": {
    id: "task-1",
    title: "Research competitor Kanban tools",
    tag: { label: "Research", className: "bg-violet-100 text-violet-700" },
    due: "Aug 18",
    assignees: ["AR", "JS"],
    progress: 20,
  },
  "task-2": {
    id: "task-2",
    title: "Create landing page wireframe",
    tag: { label: "Design", className: "bg-sky-100 text-sky-700" },
    due: "Aug 20",
    assignees: ["MK"],
    progress: 40,
  },
  "task-3": {
    id: "task-3",
    title: "Design authentication screen",
    tag: { label: "UI/UX", className: "bg-pink-100 text-pink-700" },
    due: "Aug 21",
    assignees: ["AR"],
    progress: 65,
  },
  "task-4": {
    id: "task-4",
    title: "Set up Supabase schema",
    tag: { label: "Backend", className: "bg-emerald-100 text-emerald-700" },
    due: "Aug 22",
    assignees: ["JS"],
    progress: 10,
  },
  "task-5": {
    id: "task-5",
    title: "Build drag-and-drop prototype",
    tag: { label: "Frontend", className: "bg-indigo-100 text-indigo-700" },
    due: "Aug 24",
    assignees: ["AR"],
    progress: 80,
  },
  "task-6": {
    id: "task-6",
    title: "Write project proposal",
    tag: { label: "Docs", className: "bg-amber-100 text-amber-700" },
    due: "Aug 25",
    assignees: ["TL"],
    progress: 100,
  },
};

export const initialColumns: Columns = {
  backlog: { id: "backlog", title: "Backlog", taskIds: ["task-1", "task-2"] },
  todo: { id: "todo", title: "To Do", taskIds: ["task-3", "task-4"] },
  progress: { id: "progress", title: "In Progress", taskIds: ["task-5"] },
  done: { id: "done", title: "Done", taskIds: ["task-6"] },
};
export const tagOptions: TaskTag[] = [
  { label: "Research", className: "bg-violet-100 text-violet-700" },
  { label: "Design", className: "bg-sky-100 text-sky-700" },
  { label: "UI/UX", className: "bg-pink-100 text-pink-700" },
  { label: "Backend", className: "bg-emerald-100 text-emerald-700" },
  { label: "Frontend", className: "bg-indigo-100 text-indigo-700" },
  { label: "Docs", className: "bg-amber-100 text-amber-700" },
];

export const teamMembers = ["AR", "JS", "MK", "TL"];