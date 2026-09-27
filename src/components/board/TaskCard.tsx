import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import type { Task } from "../../types/board";
import { cn } from "../../lib/utils";

export const memberColors: Record<string, string> = {
  AR: "bg-indigo-500",
  JS: "bg-emerald-500",
  MK: "bg-rose-500",
  TL: "bg-amber-500",
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const isDone = task.progress === 100;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        "cursor-grab touch-none active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100">
        {/* Gradient accent line on hover */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-3">
          {task.tag && (
            <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", task.tag.className)}>
              {task.tag.label}
            </span>
          )}
          {isDone && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Done
            </span>
          )}
        </div>

        <h3 className="mt-3 text-sm font-semibold leading-6 text-slate-900 transition-colors group-hover:text-indigo-700">
          {task.title}
        </h3>

        {typeof task.progress === "number" && (
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Progress</span>
              <span className={cn(isDone && "font-bold text-emerald-600")}>{task.progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isDone
                    ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                    : "bg-gradient-to-r from-indigo-500 to-violet-500"
                )}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          {task.due && (
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100/80 px-2.5 py-1 text-xs font-medium text-slate-600">
              <CalendarDays className="h-3.5 w-3.5 text-slate-400" /> {task.due}
            </span>
          )}
          <div className="flex -space-x-2">
            {task.assignees?.map((assignee) => (
              <div
                key={assignee}
                title={assignee}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white transition-transform hover:scale-110",
                  memberColors[assignee] ?? "bg-violet-500"
                )}
              >
                {assignee}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}